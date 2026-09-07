import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function UsefulInfo() {
  const { section } = useParams();

  const sections = {
    planting: {
      title: 'Посадка',
      content: `
        <h2>Как правильно посадить хвойное растение</h2>
        <ul>
          <li><strong>Выберите подходящее место</strong> — учитывайте освещение и тип почвы</li>
          <li><strong>Подготовьте посадочную яму</strong> — в 2-3 раза больше корневого кома</li>
          <li><strong>Установите растение</strong> — строго вертикально, корневая шейка на уровне земли</li>
          <li><strong>Засыпьте землей</strong> — уплотните и обильно полейте</li>
          <li><strong>Замульчируйте</strong> — приствольный круг для сохранения влаги</li>
        </ul>
        <p class="mt-4 text-sm text-gray-500">Лучшее время для посадки — весна или осень.</p>
      `
    },
    care: {
      title: 'Уход',
      content: `
        <h2>Основы ухода за растениями</h2>
        <ul>
          <li><strong>Полив</strong> — регулярный, особенно в первый год после посадки</li>
          <li><strong>Подкормка</strong> — комплексными удобрениями весной и летом</li>
          <li><strong>Обрезка</strong> — удаление сухих и поврежденных ветвей</li>
          <li><strong>Укрытие на зиму</strong> — для теплолюбивых видов</li>
          <li><strong>Рыхление</strong> — почвы для доступа кислорода к корням</li>
        </ul>
      `
    },
    protection: {
      title: 'Защита',
      content: `
        <h2>Защита растений от болезней и вредителей</h2>
        <ul>
          <li><strong>Профилактика</strong> — регулярные осмотры растений</li>
          <li><strong>Обработка фунгицидами</strong> — от грибных заболеваний</li>
          <li><strong>Биопрепараты</strong> — экологичная защита</li>
          <li><strong>Ловушки для вредителей</strong> — механический метод</li>
          <li><strong>Правильная агротехника</strong> — основа здоровья растений</li>
        </ul>
        <p class="mt-4 text-sm text-gray-500">При обнаружении первых признаков болезней обращайтесь к специалистам.</p>
      `
    }
  };

  const sectionData = sections[section] || sections.planting;

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
        ← Назад
      </Link>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{sectionData.title}</h1>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div 
          className="prose prose-green max-w-none"
          dangerouslySetInnerHTML={{ __html: sectionData.content }}
        />
      </div>
    </motion.div>
  );
}