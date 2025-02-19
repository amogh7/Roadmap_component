"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const defaultLessons = [
  { id: 1, title: "HTML Basics", link: "/course/html", showToast: false },
  { id: 2, title: "CSS Fundamentals", link: "/course/css", showToast: false },
  {
    id: 3,
    title: "JavaScript Essentials",
    link: "/course/javascript",
    showToast: false,
  },
  { id: 4, title: "React Basics", link: "/course/react", showToast: false },
];

export default function Roadmap() {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  useEffect(() => {
    const savedLessons =
      JSON.parse(localStorage.getItem("roadmap-lessons")) || defaultLessons;
    const savedProgress =
      JSON.parse(localStorage.getItem("roadmap-progress")) || [];

    setLessons(savedLessons);
    setCompletedLessons(savedProgress);
  }, []);

  useEffect(() => {
    localStorage.setItem("roadmap-lessons", JSON.stringify(lessons));
  }, [lessons]);

  const handleCourseCompleted = (lesson) => {
    const updatedProgress = [...new Set([...completedLessons, lesson.id])];
    setCompletedLessons(updatedProgress);
    localStorage.setItem("roadmap-progress", JSON.stringify(updatedProgress));
  };

  const handleAddNewLesson = () => {
    if (newLessonTitle.trim() === "") return;

    const newLesson = {
      id: lessons.length + 1,
      title: newLessonTitle,
      link: "/course/custom",
      showToast: false,
    };

    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    localStorage.setItem("roadmap-lessons", JSON.stringify(updatedLessons));

    setNewLessonTitle("");
  };

  function checkCompleted(lesson) {
    return completedLessons.includes(lesson.id) ? "border-image" : "";
  }

  function checkCurrentLesson(lesson) {
    const lastCompletedIndex = lessons.findIndex(
      (l) => l.id === completedLessons[completedLessons.length - 1]
    );
    return lessons[lastCompletedIndex + 1]?.id === lesson.id;
  }

  function showToast(lesson) {
    setLessons((prevLessons) =>
      prevLessons.map((course) =>
        course.id === lesson.id ? { ...course, showToast: true } : course
      )
    );
  }

  function closeToast(lesson) {
    setLessons((prevLessons) =>
      prevLessons.map((course) =>
        course.id === lesson.id ? { ...course, showToast: false } : course
      )
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-6 text-rose-50">Learning Roadmap</h2>

      <div className="mb-14 flex gap-2">
        <input
          type="text"
          placeholder="Enter course name"
          value={newLessonTitle}
          onChange={(e) => setNewLessonTitle(e.target.value)}
          className="p-2 border border-gray-400 rounded"
        />
        <button
          onClick={handleAddNewLesson}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Course
        </button>
      </div>

      <main>
        {lessons.map((lesson, index) => (
          <div
            className={`${checkCompleted(lesson)} course-container`}
            key={lesson.id}
          >
            <div
              onClick={() => showToast(lesson)}
              className="course-circle"
              tabIndex={0}
              role="button"
            ></div>
            <span className="title">{lesson.title}</span>
            <span>
              {!checkCurrentLesson(lesson) && checkCompleted(lesson) && (
                <img className="completed-image" src="completed.svg" />
              )}
              {checkCurrentLesson(lesson) && (
                <img className="completed-image avatar" src="avatar.svg" />
              )}
            </span>
            {lesson.showToast && (
              <CourseDialog
                lesson={lesson}
                index={index}
                closeToast={closeToast}
                handleCourseCompleted={handleCourseCompleted}
                lessons={lessons}
                completedLessons={completedLessons}
              />
            )}
          </div>
        ))}
      </main>

      <button
        className="bg-red-950 text-slate-100 pt-3 pb-3 px-3 rounded-md"
        onClick={() => {
          setCompletedLessons([]);
          setLessons(defaultLessons);
          localStorage.clear();
        }}
      >
        Reset
      </button>
    </div>
  );
}

function CourseDialog({
  closeToast,
  lesson,
  handleCourseCompleted,
  index,
  lessons,
  completedLessons,
}) {
  function checkPreviousCourseCompleted() {
    return index === 0 || completedLessons.includes(lessons[index - 1].id);
  }

  return (
    <div className="flex flex-col my-6 bg-purple-950 shadow-sm border border-slate-200 rounded-lg absolute h-44 toast">
      <div className="text-center mt-10">{lesson.title}</div>
      <div
        onClick={() => closeToast(lesson)}
        className="cursor-pointer absolute right-4 top-4"
      >
        <Image
          priority
          src="closebutton.svg"
          alt="Close button"
          width={20}
          height={20}
        />
      </div>
      <div className="px-4 pb-4 pt-0 mt-2 flex justify-center">
        {checkPreviousCourseCompleted() ? (
          <button
            className="rounded-md bg-slate-800 py-2 px-4 text-white"
            type="button"
            onClick={() => {
              handleCourseCompleted(lesson);
              closeToast(lesson);
            }}
          >
            Finish Course
          </button>
        ) : (
          <div>Please finish the previous course first</div>
        )}
      </div>
    </div>
  );
}
