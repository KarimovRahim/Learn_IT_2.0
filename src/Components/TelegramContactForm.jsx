import React, { useState } from "react";
import toast from "react-hot-toast";

const TelegramContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "",
    quest: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const BOT_TOKEN = "7706697018:AAFDpa6SyCbKms2SRuD2UPQfloKEdL6Zx74";
  
  const CHAT_IDS = ["976661633", "6801243832"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, age, phone, email, quest, message } = formData;

    if (!firstName.trim() || !phone.trim() || !message.trim()) {
      toast.error("Пожалуйста, заполните Имя, Телефон и Сообщение");
      return;
    }

    setLoading(true);

    const text = `🚀 <b>Новая заявка с сайта</b>\n\n` +
                 `👤 <b>Имя:</b> ${firstName} ${lastName || ""}\n` +
                 `🎂 <b>Возраст:</b> ${age || "не указан"}\n` +
                 `📞 <b>Телефон:</b> ${phone}\n` +
                 `📧 <b>Email:</b> ${email || "не указан"}\n` +
                 `🔍 <b>Откуда узнал:</b> ${quest || "не указано"}\n` +
                 `📝 <b>Сообщение:</b> ${message}`;

    try {
      const requests = CHAT_IDS.map(chatId => 
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: "HTML",
          }),
        })
      );

      await Promise.all(requests);
      toast.success("Заявка успешно отправлена!");
      setFormData({ firstName: "", lastName: "", age: "", phone: "", email: "", quest: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при отправке.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 dark:bg-zinc-900/50 dark:border-zinc-800"
      data-aos="fade-up"
      data-aos-duration="800"
      data-aos-delay="200"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Имя */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-black dark:text-zinc-300">Имя *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:focus:border-red-500"
              placeholder="Введите имя"
              required
            />
          </div>
          {/* Фамилия */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-black dark:text-zinc-300">Фамилия</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:focus:border-red-500"
              placeholder="Введите фамилию"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Телефон */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-black dark:text-zinc-300">Телефон *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:focus:border-red-500"
              placeholder="+992"
              required
            />
          </div>
          {/* Возраст */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-black dark:text-zinc-300">Возраст</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:focus:border-red-500"
              placeholder="Ваш возраст"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-zinc-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:focus:border-red-500"
            placeholder="email@example.com"
          />
        </div>

        {/* Откуда узнали */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-zinc-300">Откуда вы о нас узнали?</label>
          <input
            type="text"
            name="quest"
            value={formData.quest}
            onChange={handleChange}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:focus:border-red-500"
            placeholder="Instagram, друзья, реклама..."
          />
        </div>

        {/* Сообщение */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-zinc-300">Сообщение *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors min-h-[120px] dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:focus:border-red-500"
            placeholder="Опишите вашу задачу"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 mt-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? "Отправка..." : "Отправить заявку"}
        </button>

        <p className="text-xs text-black/50 text-center mt-4 dark:text-zinc-500">
          Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
        </p>
      </form>
    </div>
  );
};

export default TelegramContactForm;