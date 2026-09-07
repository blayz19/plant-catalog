import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function About() {
  const { section } = useParams();

  const sections = {
    collection: {
      title: 'Коллекция растений',
      content: 'Наша коллекция насчитывает более 100 видов и сортов хвойных, лиственных и декоративных растений. Мы гордимся уникальными экземплярами, собранными со всего мира.',
      image: '🌲'
    },
    science: {
      title: 'Научная работа',
      content: 'Мы проводим исследования по акклиматизации и селекции растений в условиях средней полосы России. Наши научные работы публикуются в ведущих российских и международных журналах.',
      image: '🔬'
    },
    selection: {
      title: 'Селекция',
      content: 'Нашими специалистами выведено более 20 новых сортов растений, адаптированных к российскому климату. Каждый сорт проходит многолетние испытания.',
      image: '🧬'
    },
    introduction: {
      title: 'Интродукция',
      content: 'Мы занимаемся введением в культуру новых видов растений из разных климатических зон. Это позволяет обогатить российские сады уникальными растениями.',
      image: '🌍'
    },
    tours: {
      title: 'Экскурсии',
      content: 'Приглашаем на экскурсии по нашему ботаническому саду и питомнику. Мы расскажем о каждом растении, покажем коллекцию и ответим на все вопросы.',
      image: '🚶'
    },
    media: {
      title: 'СМИ о нас',
      content: 'О нашей работе писали ведущие издания: "Садовод", "Ландшафтный дизайн", "Цветоводство", "Наука и жизнь". Мы регулярно участвуем в телепередачах о садоводстве.',
      image: '📰'
    },
    vacancies: {
      title: 'Вакансии',
      content: 'Мы всегда ищем талантливых агрономов, дендрологов и садоводов. Присоединяйтесь к нашей команде! Отправляйте резюме на info@sadik.ru',
      image: '💼'
    },
    publications: {
      title: 'Наши публикации',
      content: 'Мы регулярно публикуем статьи в научных журналах и популярных изданиях по садоводству. Наши исследования посвящены селекции, интродукции и уходу за растениями.',
      image: '📚'
    },
    exhibition: {
      title: 'Выставка дендроарта',
      content: 'Ежегодно мы проводим выставку дендроарта, где представляем лучшие образцы художественной обработки растений. Приглашаем всех желающих!',
      image: '🎨'
    }
  };

  const sectionData = sections[section] || sections.collection;

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
      <div className="text-6xl mb-6">{sectionData.image}</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{sectionData.title}</h1>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <p className="text-lg text-gray-700 leading-relaxed">{sectionData.content}</p>
      </div>
    </motion.div>
  );
}