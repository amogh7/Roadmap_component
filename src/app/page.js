"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const getAllLessons = [
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
  const [lessons, setLessons] = useState(getAllLessons);

  useEffect(() => {
    const savedProgress =
      JSON.parse(localStorage.getItem("roadmap-progress")) || [];
    setCompletedLessons(savedProgress);
  }, []);

  const handleCourseCompleted = (lesson) => {
    const updatedProgress = [...new Set([...completedLessons, lesson.id])];
    setCompletedLessons(updatedProgress);
    localStorage.setItem("roadmap-progress", JSON.stringify(updatedProgress));
  };

  function checkCompleted(lesson) {
    if (completedLessons.indexOf(lesson.id) !== -1) {
      return "border-image";
    }
    return "";
  }

  function checkCurrentLesson(lesson) {
    const lastCompletedIndex = lessons.findIndex(
      (l) => l.id === completedLessons[completedLessons.length - 1]
    );
    return lessons[lastCompletedIndex + 1]?.id === lesson.id;
  }

  function showToast(lesson) {
    let updatedLessons = lessons.map((course) => {
      if (lesson.id === course.id) {
        return { ...course, showToast: true };
      }
      return course;
    });
    setLessons([...updatedLessons]);
  }
  function closeToast(lesson) {
    let updatedLessons = lessons.map((course) => {
      if (lesson.id === course.id) {
        return { ...course, showToast: false };
      }
      return course;
    });

    setLessons([...updatedLessons]);
    console.log(lessons, "upda");
  }

  const handleKeyPress = (event, lesson) => {
    if (event.key === "Enter") {
      showToast(lesson);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-6 text-rose-50">Learning Roadmap</h2>

      <main>
        {lessons.map((lesson, index) => {
          return (
            <div
              className={`${checkCompleted(lesson)} course-container`}
              key={index}
            >
              <div
                onClick={() => showToast(lesson)}
                className="course-circle"
                onKeyPress={(event) => handleKeyPress(event, lesson)}
                tabIndex={0}
                ariaLabel="open course"
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
          );
        })}
      </main>
      <button
        className=" bg-red-950 pt-3 pb-3 pl-3 pr-3 rounded-md"
        onClick={() => {
          setCompletedLessons([]);
          localStorage.clear([]);
        }}
      >
        reset progress
      </button>
    </div>
  );
}

function CourseDialog(props) {
  let {
    closeToast,
    lesson,
    handleCourseCompleted,
    index,
    lessons,
    completedLessons,
  } = props;
  function checkPreviousCourseCompleted() {
    if (index > 0 && completedLessons.indexOf(lessons[index - 1].id) !== -1) {
      return true;
    }
    return false;
  }

  const handleKeyPress = (event, lesson) => {
    if (event.key === "Enter") {
      closeToast(lesson);
    }
  };

  return (
    <>
      <div className="flex flex-col my-6 bg-purple-950 shadow-sm border border-slate-200 rounded-lg absolute h-44 toast">
        <div className="text-center mt-10">{props.lesson.title} </div>
        <div
          onClick={() => {
            closeToast(lesson);
          }}
          tabIndex={0}
          ariaLabel="close button"
          className="cursor-pointer absolute right-4 top-4"
          onKeyPress={(event) => handleKeyPress(event, lesson)}
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
          {checkPreviousCourseCompleted() || index == 0 ? (
            <button
              className="rounded-md  bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => {
                handleCourseCompleted(lesson);
                closeToast(lesson);
              }}
            >
              finish Course
            </button>
          ) : (
            <div>Please finish previous course first </div>
          )}
        </div>
      </div>
    </>
  );
}
