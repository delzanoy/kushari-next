import svgPaths from "./svg-pt2uc8jul8";
import imgNoise from "../../../public/noise.png";

// Shared SVG filter components
const SvgFilter = {
  Blur: ({ id, stdDeviation = 162 }: { id: string; stdDeviation?: number }) => (
    <filter
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
      id={`filter_${id}`}
      x="0"
      y="0"
      width="100%"
      height="100%"
    >
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
      <feGaussianBlur result="effect1_foregroundBlur" stdDeviation={stdDeviation} />
    </filter>
  ),
};

// Blob shine component with proper encapsulation
const BlobShine = () => (
  <div className="absolute flex h-[446px] items-center justify-center left-[49px] top-[149px] w-[499px]">
    <div className="rotate-180">
      <div className="h-[446px] relative w-[499px]">
        <div className="absolute inset-[-72.65%_-64.93%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1147 1094"
          >
            <g filter={`url(#filter_blob-shine)`}>
              <path
                clipRule="evenodd"
                d={svgPaths.p3801f100}
                fill="#E5F25A"
                fillRule="evenodd"
              />
            </g>
            <defs>
              <SvgFilter.Blur id="blob-shine" />
            </defs>
          </svg>
        </div>
      </div>
    </div>
  </div>
);

// Arc component with configurable color
const Arc = ({
  left,
  top,
  color,
  dataName,
}: {
  left: string;
  top: string;
  color: string;
  dataName: string;
}) => (
  <div
    className="absolute h-[410px] mix-blend-overlay w-[840px]"
    style={{ left, top }}
    data-name={dataName}
  >
    <div className="absolute inset-[-22.93%_-11.19%]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1028 598"
      >
        <g filter={`url(#filter_arc-${dataName})`} style={{ mixBlendMode: "overlay" }}>
          <path d={svgPaths.p3f195300} fill={color} />
        </g>
        <defs>
          <SvgFilter.Blur id={`arc-${dataName}`} stdDeviation={47} />
        </defs>
      </svg>
    </div>
  </div>
);

// Glow ellipse component for reusability
const GlowEllipse = ({
  id,
  left,
  top,
  width,
  height,
  rotation,
  cx,
  cy,
  rx,
  ry,
  opacity = 1,
}: {
  id: string;
  left: string;
  top: string;
  width: string;
  height: string;
  rotation: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  opacity?: number;
}) => (
  <div
    className="absolute flex items-center justify-center mix-blend-overlay"
    style={{
      left,
      top,
      width,
      height,
      "--transform-inner-width": "0",
      "--transform-inner-height": "0",
    } as React.CSSProperties}
  >
    <div className={`flex-none rotate-[${rotation}]`}>
      <div className="relative" style={{ width, height }} data-name={id}>
        <div className="absolute inset-[-152.88%_-18.62%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1290 465"
          >
            <g
              filter={`url(#filter_${id})`}
              id={id}
              style={{ mixBlendMode: "overlay", opacity }}
            >
              <ellipse cx={cx} cy={cy} fill="white" rx={rx} ry={ry} />
            </g>
            <defs>
              <SvgFilter.Blur id={id} stdDeviation={87.5} />
            </defs>
          </svg>
        </div>
      </div>
    </div>
  </div>
);

// Frame component with improved structure
function Frame() {
  return (
    <div className="absolute h-[595px] left-0 top-[679.04px] w-[1090px]">
      <BlobShine />
      <Arc
        left="0"
        top="116px"
        color="white"
        dataName="arc-white-left"
      />
      <Arc
        left="250px"
        top="0"
        color="#C5E7FF"
        dataName="arc-pink-top"
      />
    </div>
  );
}

// Main Background component
export default function Background() {
  return (
    <div className="relative size-full" data-name="Background">
      {/* Gradient overlay */}
      <div
        className="absolute bg-gradient-to-b from-[#2d3436] from-[6.925%] to-[#2aa9cd] h-[956px] left-0 mix-blend-overlay opacity-60 w-[440px]"
        data-name="gradient-overlay"
      />

      <Frame />

      {/* Noise texture */}
      <div
        className="absolute bg-repeat bg-size-[3072px_3072px] bg-top-left h-[956px] left-0 mix-blend-soft-light opacity-[0.08] top-0 w-[440px]"
        data-name="noise"
        style={{ backgroundImage: `url('${imgNoise}')` }}
      />

      {/* Glow effects */}
      <GlowEllipse
        id="top-card-glow-1"
        left="333px"
        top="134.03px"
        width="945.65px"
        height="268.524px"
        rotation="9.534deg"
        cx={644.834}
        cy={232.235}
        rx={469.834}
        ry={57.2352}
      />

      <GlowEllipse
        id="top-card-glow-2"
        left="49px"
        top="0"
        width="742.122px"
        height="340.17px"
        rotation="348.16deg"
        cx={533.449}
        cy={273.639}
        rx={358.449}
        ry={98.6389}
      />

      <GlowEllipse
        id="top-card-glow-3"
        left="49px"
        top="0"
        width="742.122px"
        height="340.17px"
        rotation="348.16deg"
        cx={533.449}
        cy={273.639}
        rx={358.449}
        ry={98.6389}
        opacity={0.1}
      />
    </div>
  );
}