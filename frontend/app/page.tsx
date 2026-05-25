// // // import Image from "next/image";

// // // export default function Home() {
// // //   return (
// // //     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
// // //       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
// // //         <Image
// // //           className="dark:invert"
// // //           src="/next.svg"
// // //           alt="Next.js logo"
// // //           width={100}
// // //           height={20}
// // //           priority
// // //         />
// // //         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
// // //           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
// // //             To get started, edit the page.tsx file.
// // //           </h1>
// // //           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
// // //             Looking for a starting point or more instructions? Head over to{" "}
// // //             <a
// // //               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // //               className="font-medium text-zinc-950 dark:text-zinc-50"
// // //             >
// // //               Templates
// // //             </a>{" "}
// // //             or the{" "}
// // //             <a
// // //               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // //               className="font-medium text-zinc-950 dark:text-zinc-50"
// // //             >
// // //               Learning
// // //             </a>{" "}
// // //             center.
// // //           </p>
// // //         </div>
// // //         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
// // //           <a
// // //             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
// // //             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // //             target="_blank"
// // //             rel="noopener noreferrer"
// // //           >
// // //             <Image
// // //               className="dark:invert"
// // //               src="/vercel.svg"
// // //               alt="Vercel logomark"
// // //               width={16}
// // //               height={16}
// // //             />
// // //             Deploy Now
// // //           </a>
// // //           <a
// // //             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
// // //             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // //             target="_blank"
// // //             rel="noopener noreferrer"
// // //           >
// // //             Documentation
// // //           </a>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // }




// // // export default function Home() {
// // //   return (
// // //     <main className="min-h-screen flex items-center justify-center">
// // //       <h1 className="text-3xl font-bold">VedaAI Frontend Starting...</h1>
// // //     </main>
// // //   );
// // // }


// // import CreateAssignmentForm from './components/CreateAssignmentForm';

// // export default function Home() {
// //   return (
// //     <div className="min-h-screen flex p-4 gap-6">
      
// //       {/* Sidebar (Matches Figma Style) */}
// //       <aside className="w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hidden md:flex">
// //         <div>
// //           <div className="flex items-center gap-3 mb-10">
// //             <div className="bg-orange-600 text-white font-bold p-2 rounded-lg leading-none">V</div>
// //             <h1 className="text-2xl font-bold tracking-tight text-gray-900">VedaAI</h1>
// //           </div>
          
// //           <button className="w-full bg-[#2D2D2D] text-white rounded-full py-3 text-sm font-medium mb-8 hover:bg-black transition">
// //             ✨ Create Assignment
// //           </button>

// //           <nav className="space-y-4 text-sm font-medium text-gray-600">
// //             <a href="#" className="flex items-center gap-3 hover:text-gray-900">Home</a>
// //             <a href="#" className="flex items-center gap-3 hover:text-gray-900">My Groups</a>
// //             <a href="#" className="flex items-center gap-3 text-gray-900 bg-gray-100 px-3 py-2 rounded-lg -mx-3">Assignments</a>
// //             <a href="#" className="flex items-center gap-3 hover:text-gray-900">AI Teacher's Toolkit</a>
// //             <a href="#" className="flex items-center justify-between hover:text-gray-900">
// //               <span className="flex items-center gap-3">My Library</span>
// //               <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">32</span>
// //             </a>
// //           </nav>
// //         </div>
// //       </aside>

// //       {/* Main Content Area */}
// //       <main className="flex-1 flex flex-col">
// //         {/* Top Navbar */}
// //         <header className="flex items-center justify-between mb-8">
// //           <div className="flex items-center gap-4 text-gray-500 font-medium">
// //             <button className="hover:text-gray-900">←</button>
// //             <span className="text-gray-400">Assignment</span>
// //           </div>
// //           <div className="flex items-center gap-4">
// //              {/* Notification Bell Placeholder */}
// //              <div className="w-8 h-8 bg-white rounded-full border border-gray-200"></div>
// //              <div className="text-sm font-bold text-gray-800">John Doe ⌄</div>
// //           </div>
// //         </header>

// //         {/* The Form */}
// //         <div className="flex-1 overflow-auto pb-10">
// //            <CreateAssignmentForm />
// //         </div>
// //       </main>

// //     </div>
// //   );
// // }


// 'use client';
// import CreateAssignmentForm from './components/CreateAssignmentForm';
// import ResultsView from './components/ResultsView';
// import { useAssessmentStore } from './store/useAssessmentStore';

// export default function Home() {
//   const store = useAssessmentStore();

//   return (
//     <div className="min-h-screen flex p-4 gap-6">
      
//       {/* Sidebar */}
//       <aside className="w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hidden md:flex">
//         <div>
//           <div className="flex items-center gap-3 mb-10">
//             <div className="bg-orange-600 text-white font-bold p-2 rounded-lg leading-none">V</div>
//             <h1 className="text-2xl font-bold tracking-tight text-gray-900">VedaAI</h1>
//           </div>
          
//           <button 
//             onClick={() => store.setGeneratedPaper(null)} 
//             className="w-full bg-[#2D2D2D] text-white rounded-full py-3 text-sm font-medium mb-8 hover:bg-black transition"
//           >
//             ✨ Create Assignment
//           </button>

//           <nav className="space-y-4 text-sm font-medium text-gray-600">
//             <a href="#" className="flex items-center gap-3 hover:text-gray-900">Home</a>
//             <a href="#" className="flex items-center gap-3 hover:text-gray-900">My Groups</a>
//             <a href="#" className="flex items-center gap-3 text-gray-900 bg-gray-100 px-3 py-2 rounded-lg -mx-3">Assignments</a>
//             <a href="#" className="flex items-center gap-3 hover:text-gray-900">AI Teacher's Toolkit</a>
//             <a href="#" className="flex items-center justify-between hover:text-gray-900">
//               <a href="#" className="flex items-center gap-3 hover:text-gray-900">My Library</a>
//             </a>
//           </nav>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 flex flex-col">
//         <header className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4 text-gray-500 font-medium">
//             <button className="hover:text-gray-900">←</button>
//             <span className="text-gray-400">Assignment</span>
//           </div>
//           <div className="flex items-center gap-4">
//              <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300"></div>
//              <div className="text-sm font-bold text-gray-800">John Doe ⌄</div>
//           </div>
//         </header>

//         {/* SWAP VIEWS BASED ON STATE */}
//         <div className="flex-1 overflow-auto pb-10">
//            {store.generatedPaper ? <ResultsView /> : <CreateAssignmentForm />}
//         </div>
//       </main>

//     </div>
//   );
// }





'use client';
import CreateAssignmentForm from './components/CreateAssignmentForm';
import ResultsView from './components/ResultsView';
import { useAssessmentStore } from './store/useAssessmentStore';

export default function Home() {
  const store = useAssessmentStore();

  return (
    <div className="min-h-screen flex p-4 gap-6">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-orange-600 text-white font-bold p-2 rounded-lg leading-none">V</div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">VedaAI</h1>
          </div>
          
          <button 
            onClick={() => store.setGeneratedPaper(null)} 
            className="w-full bg-[#2D2D2D] text-white rounded-full py-3 text-sm font-medium mb-8 hover:bg-black transition"
          >
            ✨ Create Assignment
          </button>

          <nav className="space-y-4 text-sm font-medium text-gray-600">
            <a href="#" className="flex items-center gap-3 hover:text-gray-900">Home</a>
            <a href="#" className="flex items-center gap-3 hover:text-gray-900">My Groups</a>
            <a href="#" className="flex items-center gap-3 text-gray-900 bg-gray-100 px-3 py-2 rounded-lg -mx-3">Assignments</a>
            <a href="#" className="flex items-center gap-3 hover:text-gray-900">AI Teacher's Toolkit</a>
            {/* FIXED: Removed the nested <a> tags here */}
            <a href="#" className="flex items-center gap-3 hover:text-gray-900">My Library</a>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 text-gray-500 font-medium">
            <button className="hover:text-gray-900">←</button>
            <span className="text-gray-400">Assignment</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300"></div>
             <div className="text-sm font-bold text-gray-800">John Doe ⌄</div>
          </div>
        </header>

        {/* SWAP VIEWS BASED ON STATE */}
        <div className="flex-1 overflow-auto pb-10">
           {store.generatedPaper ? <ResultsView /> : <CreateAssignmentForm />}
        </div>
      </main>

    </div>
  );
}