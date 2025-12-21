import Aurora from '@/components//Aurora';

export default function BackgroundLightPillar() {
    return (
        <div className='relative h-[250vh] overflow-hidden'>
            <Aurora
                colorStops={["#C5E7FF", "#73E9EA", "#E5F25A"]}
                blend={10}
                amplitude={1.0}
                speed={.5}
            />
        </div>
    )
}