export default function Contacts() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Как добраться</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Контактная информация */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Контакты
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Адрес</h3>
                <p className="text-lg text-gray-800">
                  Томский район, село Курлек, микрорайон Кедр
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Телефон</h3>
                <a
                  href="tel:+74951234567"
                  className="text-lg text-green-600 hover:underline"
                >
                  +7 (913) 853-17-73
                </a>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <a
                  href="mailto:info@sadik.ru"
                  className="text-lg text-green-600 hover:underline"
                >
                  info@sadik.ru
                </a>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Часы работы
                </h3>
                <p className="text-lg text-gray-800">Пн-Вс: 8:00 – 17:00</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href="https://yandex.ru/maps/org/sibirskaya_akademiya_derevyev_i_kustarnikov/1726000516/?ll=84.866684%2C56.226214&z=17"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Открыть в Яндекс.Картах
              </a>
            </div>
          </div>
        </div>

        {/* Карта */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ae903d7b0af6c22e1af338e10ad56dfa4e7948d1cdb5b7f1d8b814205f16efb18&amp;source=constructor" width="775" height="564" frameborder="0"></iframe>
          <div className="p-4 bg-gray-50">
            <p className="text-sm text-gray-500 text-center">
              📍 Томский район, село Курлек, микрорайон Кедр
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
