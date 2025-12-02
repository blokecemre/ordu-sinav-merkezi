"use client"

import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { getSliderImages } from '@/app/actions/slider'
import { Loader2 } from 'lucide-react'

export function HomepageSlider() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])
    const [images, setImages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchImages = async () => {
            const result = await getSliderImages()
            if (result.success) {
                setImages(result.data || [])
            }
            setLoading(false)
        }
        fetchImages()
    }, [])

    if (loading) {
        return <div className="w-full h-[400px] md:h-[500px] bg-gray-100 flex items-center justify-center"><Loader2 className="animate-spin" /></div>
    }

    if (images.length === 0) {
        return null // Don't show anything if no images
    }

    return (
        <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
                {images.map((img) => (
                    <div key={img.id} className="embla__slide flex-[0_0_100%] min-w-0 relative h-[200px] sm:h-[300px] md:h-[500px] bg-gray-50">
                        <img
                            src={`/api/slider/${img.id}/image`}
                            alt="Slider"
                            className="w-full h-full object-contain md:object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
