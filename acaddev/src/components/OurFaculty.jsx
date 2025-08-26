export default function OurFaculty() {
    const faculty = [
      {
        name: "Mr. Ghazi Sabeehuddin",
        subject: "Physics Faculty",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        desc: "MSc in Applied Physics, IITKGP",
      },
      {
        name: "Mr. Faraaz",
        subject: "Maths Faculty",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        desc: "MSc in Mathematics, IITKGP",
      },
      {
        name: "Mr. Ghazi Sabeehuddin",
        subject: "Physics Faculty",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        desc: "MSc in Applied Physics, IITKGP",
      },
      {
        name: "Mr. Faraaz",
        subject: "Maths Faculty",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        desc: "MSc in Mathematics, IITKGP",
      }
    ];
  
    return (
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-wide">
            Our Faculty
          </h2>
          <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
            Meet our team of experienced mentors who guide students with expertise, passion, and dedication.
          </p>
  
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {faculty.map((f, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer"
              >
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="w-full h-full object-cover rounded-full border-4 border-indigo-100"
                  />
                  {/* Optional animated halo or gradient overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 opacity-30 blur-xl animate-pulse"></div>
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
  