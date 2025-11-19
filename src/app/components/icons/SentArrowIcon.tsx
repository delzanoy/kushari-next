// export function SentArrowIcon({ className = "", color = "#F8FCFF" }: { className?: string; color?: string }) {
//     return (
//         <svg className={`block w-[18px] h-[18px] p-[2px] ${className}`} fill="none" viewBox="0 0 15 15">

//         </svg>
//     );
// }




export function SentArrowIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`block ${className}`} viewBox="0 0 24 24" fill="currentColor"><path d="M4.22173 18.3642L5.63574 19.7784L15.2427 10.1716L19.071 14L19.071 4.92892L9.99999 4.92893L13.8284 8.75738L4.22173 18.3642Z"></path></svg>
  );
}