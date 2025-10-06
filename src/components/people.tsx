import { useContent } from "@/hooks/use-content";
import { useBasePath } from "@/hooks/use-base-path";
import { Mail, Globe, GraduationCap } from "lucide-react";

interface Person {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  website?: string;
  scholar?: string;
  image: string;
}

interface Postdoc {
  id: string;
  name: string;
  research: string;
  email?: string;
  website?: string;
  image: string;
}

interface PhDStudent {
  id: string;
  name: string;
  year: string;
  research: string;
  image: string;
  email?: string;
  website?: string;
  scholar?: string;
}

interface Student {
  id: string;
  name: string;
  level: string;
  research: string;
  image: string;
  email?: string;
  website?: string;
  scholar?: string;
}

interface Alumni {
  id: string;
  name: string;
  degree: string;
  year: string;
  current_position: string;
  image: string;
  email?: string;
  website?: string;
  scholar?: string;
}

export default function People() {
  const { getAssetPath } = useBasePath();
  const { data: peopleData, isLoading } = useContent<{
    directors: Person[];
    affiliated_faculty: Person[];
    postdocs: Postdoc[];
    phd_students: PhDStudent[];
    students: Student[];
    alumni: Alumni[];
  }>('people');

  if (isLoading) {
    return (
      <section id="people" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Our Team</h2>
          <div className="text-center text-uw-gray">Loading team information...</div>
        </div>
      </section>
    );
  }

  const directors = peopleData?.directors || [];
  const affiliatedFaculty = peopleData?.affiliated_faculty || [];
  const postdocs = peopleData?.postdocs || [];
  const phdStudents = peopleData?.phd_students || [];
  const students = peopleData?.students || [];
  const alumni = peopleData?.alumni || [];

  return (
    <section id="people" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Our Team</h2>
        
        {/* Directors */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-uw-slate mb-6">Directors</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {directors.map((person) => (
              <div key={person.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <img 
                  src={getAssetPath(person.image)} 
                  alt={`${person.name} profile`} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-lg font-semibold text-uw-slate text-center">{person.name}</h4>
                <p className="text-uw-gray text-center mb-2">{person.title}</p>
                <p className="text-sm text-uw-gray text-center mb-4">{person.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a href={`mailto:${person.email}`} className="text-uw-blue hover:text-uw-sky">
                    <Mail size={18} />
                  </a>
                  <a href={person.website || '#'} className={person.website ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Globe size={18} />
                  </a>
                  {person.scholar && (
                    <a href={person.scholar} className="text-uw-blue hover:text-uw-sky">
                      <GraduationCap size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliated Faculty */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-uw-slate mb-6">Affiliated Faculty</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affiliatedFaculty.map((person) => (
              <div key={person.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <img 
                  src={getAssetPath(person.image)} 
                  alt={`${person.name} profile`} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-lg font-semibold text-uw-slate text-center">{person.name}</h4>
                <p className="text-uw-gray text-center mb-2">{person.title}</p>
                <p className="text-sm text-uw-gray text-center mb-4">{person.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a href={`mailto:${person.email}`} className="text-uw-blue hover:text-uw-sky">
                    <Mail size={18} />
                  </a>
                  <a href={person.website || '#'} className={person.website ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Globe size={18} />
                  </a>
                  {person.scholar && (
                    <a href={person.scholar} className="text-uw-blue hover:text-uw-sky">
                      <GraduationCap size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Postdocs */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-uw-slate mb-6">Postdocs</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postdocs.map((postdoc) => (
              <div key={postdoc.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <img 
                  src={getAssetPath(postdoc.image)} 
                  alt={`${postdoc.name} profile`} 
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h4 className="text-base font-semibold text-uw-slate text-center">{postdoc.name}</h4>
                <p className="text-sm text-uw-gray text-center mb-4">{postdoc.research}</p>
                <div className="flex justify-center space-x-3">
                  <a href={postdoc.email ? `mailto:${postdoc.email}` : '#'} className={postdoc.email ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Mail size={16} />
                  </a>
                  <a href={postdoc.website || '#'} className={postdoc.website ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Globe size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PhD Students */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-uw-slate mb-6">PhD Students</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phdStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <img 
                  src={getAssetPath(student.image)} 
                  alt={`${student.name} profile`} 
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h4 className="text-base font-semibold text-uw-slate text-center">{student.name}</h4>
                <p className="text-sm text-uw-gray text-center mb-2">{student.year}</p>
                <p className="text-xs text-uw-gray text-center mb-4">{student.research}</p>
                <div className="flex justify-center space-x-3">
                  <a href={student.email ? `mailto:${student.email}` : '#'} className={student.email ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Mail size={16} />
                  </a>
                  <a href={student.website || '#'} className={student.website ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Globe size={16} />
                  </a>
                  {student.scholar && (
                    <a href={student.scholar} className="text-uw-blue hover:text-uw-sky">
                      <GraduationCap size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Undergraduate and Master Students */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-uw-slate mb-6">Undergraduate and Master Students</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {students.map((student) => (
              <div key={student.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <img 
                  src={getAssetPath(student.image)} 
                  alt={`${student.name} profile`} 
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h4 className="text-base font-semibold text-uw-slate text-center">{student.name}</h4>
                <p className="text-sm text-uw-gray text-center mb-2">{student.level}</p>
                <p className="text-xs text-uw-gray text-center mb-4">{student.research}</p>
                <div className="flex justify-center space-x-3">
                  <a href={student.email ? `mailto:${student.email}` : '#'} className={student.email ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Mail size={16} />
                  </a>
                  <a href={student.website || '#'} className={student.website ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Globe size={16} />
                  </a>
                  {student.scholar && (
                    <a href={student.scholar} className="text-uw-blue hover:text-uw-sky">
                      <GraduationCap size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alumni */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-uw-slate mb-6">Alumni</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map((alum) => (
              <div key={alum.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <img 
                  src={getAssetPath(alum.image)} 
                  alt={`${alum.name} profile`} 
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h4 className="text-base font-semibold text-uw-slate text-center">{alum.name}</h4>
                <p className="text-sm text-uw-gray text-center mb-1">{alum.degree} • {alum.year}</p>
                <p className="text-xs text-uw-gray text-center mb-4">{alum.current_position}</p>
                <div className="flex justify-center space-x-3">
                  <a href={alum.email ? `mailto:${alum.email}` : '#'} className={alum.email ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Mail size={16} />
                  </a>
                  <a href={alum.website || '#'} className={alum.website ? "text-uw-blue hover:text-uw-sky" : "text-gray-300"}>
                    <Globe size={16} />
                  </a>
                  {alum.scholar && (
                    <a href={alum.scholar} className="text-uw-blue hover:text-uw-sky">
                      <GraduationCap size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
