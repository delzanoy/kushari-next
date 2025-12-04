// "use client";
// import React from "react";
// import { ModalProvider } from "./ModalProvider";
// import { Modal } from "./Modal";
// import { useModal } from "@/app/hooks/useModal";
// import FeatureUnderDevelopment from "../FeatureUnderDevelopment";

// /**
//  * ModalDemo renders a button that opens a modal whose content is the
//  * FeatureUnderDevelopment component (using that file's styling as requested).
//  *
//  * The FeatureUnderDevelopment component already contains its own header, close button,
//  * and visual styles, so Modal only provides the backdrop, focus handling, and stacking.
//  */

// export default function ModalDemoShell() {
//   return (
//     <ModalProvider>
//       <DemoPage />
//     </ModalProvider>
//   );
// }

// function DemoPage() {
//   const { open, closeTop } = useModal();

//   const openFeatureModal = () => {
//     const id = open(
//       <Modal
//         // Modal wrapper left mostly unobtrusive because FeatureUnderDevelopment has its own styling
//         onClose={() => {
//           // close top when child requests close via onClose prop
//           closeTop();
//         }}
//       >
//         <FeatureUnderDevelopment
//           onClose={() => {
//             closeTop();
//           }}
//         />
//       </Modal>
//     );

//     return id;
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl mb-4">Modal Demo — FeatureUnderDevelopment</h1>
//       <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={openFeatureModal}>
//         Open Feature Feedback Modal
//       </button>
//     </div>
//   );
// }