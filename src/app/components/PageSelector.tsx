import { useState, useRef, useEffect } from "react";
import { SmallArrowDown } from "@/app/components/icons"; // Adjust import path as needed

const PageSelector = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Create array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Same as before */}
      <div
        className="group/dropdown flex py-[2px] px-[8px] items-center gap-[6px] rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 hover:border-[#F8FCFF] hover:bg-[#F8FCFF]/16 hover:cursor-pointer transition-all duration-150 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px] group-hover/dropdown:text-[#FFFFFF]">
          Pg. {currentPage}
        </span>
        <SmallArrowDown className={`h-[16px] w-[16px] opacity-80 group-hover/dropdown:text-[#FFFFFF] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Updated Dropdown List */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 max-h-80 overflow-y-auto z-50"
          style={{ width: '120px', minWidth: '120px' }}
        >
          <div className="flex flex-col m-1 gap-0.5">
            {pageNumbers.length === 0 ? (
              <div className="px-3 py-4 text-sm text-[#F8FCFF]/50 text-center">
                No pages available
              </div>
            ) : (
              pageNumbers.map((page) => (
                <div
                  key={page}
                  className={`group/option flex flex-row justify-between items-center pt-[8px] pr-[12px] pb-[8px] pl-[16px] flex-col gap-2.5 rounded-[10px] hover:bg-[#F8FCFF]/8 hover:cursor-pointer ${
                    page === currentPage 
                      ? 'bg-[#1C2325]' 
                      : ''
                  }`}
                  onClick={() => {
                    onPageChange(page);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={
                      page === currentPage 
                        ? 'text-[#A6FCFC] font-medium' 
                        : 'text-[#F8FCFF]'
                    }>
                      Page {page}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSelector;