import co_founder_one from '../assets/co_founder_one.png';
import co_founder_two from '../assets/co_founder_two.jpg';

export default function OurFounders() {
  const founders = [
    {
      name: 'Mr. Ghazi Sabeehuddin',
      image: co_founder_one,
      desc: 'Integrated Master of Science, Chemistry, IIT Kharagpur',
      linkedin: 'https://www.linkedin.com/in/ghazi-sabeehuddin-758263214/'
    },
    {
      name: 'Mr. Faraaz Deshmukh',
      image: co_founder_two,
      desc: 'Integrated Master of Science, Chemistry, IIT Kharagpur',
      linkedin: 'https://www.linkedin.com/in/faraz-deshmukh-37906a11b/'
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-wide">
          Founders
        </h2>
        <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
          Meet our co-founders whose aim is to provide students with the platform they deserve to excel.
        </p>

        <div className="flex flex-wrap justify-center gap-10">
          {founders.map((f, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer w-72"
            >
              <div className="flex justify-center items-center relative w-32 h-32 mb-4">
                <img
                  src={f.image}
                  alt={f.name}
                  onClick={() => window.open(f.linkedin, '_blank')}
                  className="w-full h-full object-cover rounded-full border-4 border-indigo-100 z-10"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 opacity-30 blur-xl animate-pulse z-0"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{f.name}</h3>
              <p className="text-indigo-600 font-medium">{f.subject}</p>
              <p className="text-gray-600 mt-2 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
