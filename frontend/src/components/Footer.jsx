export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">САДиК</h3>
            <p className="text-gray-400">Коллекционные сорта кедров и сосен</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <p className="text-gray-400">+7 (XXX) XXX-XX-XX</p>
            <p className="text-gray-400">info@kedr.ru</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <p className="text-gray-400">© 2026 Все права защищены</p>
          </div>
        </div>
      </div>
    </footer>
  );
}