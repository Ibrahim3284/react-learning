export default function CoursesOffered() {
    const courses = [
      {
        title: "JEE",
        description:
          "Comprehensive preparation for JEE Main & Advanced with expert faculty, mock tests, and detailed study materials.",
        image: "data:image/jpeg;base64,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"
      },
      {
        title: "NEET",
        description:
          "Structured curriculum for NEET aspirants focusing on Biology, Chemistry, and Physics with regular assessments.",
        image: "https://directmbbsadmission.in/wp-content/uploads/2024/01/NEET.webp"
      },
      {
        title: "Foundation",
        description:
          "Early foundation courses for Class 8–10 students to strengthen basics in Math & Science for competitive exams.",
        image: "https://media.licdn.com/dms/image/v2/D560BAQEnFqtZD_HmuA/company-logo_200_200/company-logo_200_200/0/1711979691644/coachfoundation_logo?e=2147483647&v=beta&t=YtUy2Pw6xe3wXvZnZyIIQuWKAC3nZLji-r4UWCNJij4"
      }
    ];
  
    return (
      <div className="w-full py-16 px-6 bg-gray-50">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 tracking-wide">
          Our Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl cursor-pointer"
            >
              <div className="relative h-52">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {/* Optional gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">{course.title}</h3>
                <p className="text-gray-600 text-sm">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  