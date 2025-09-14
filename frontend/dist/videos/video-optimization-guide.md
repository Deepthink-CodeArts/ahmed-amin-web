# Video Optimization Guide for Aro Global Studies

## Quick Setup Instructions

1. **Add your video files to this folder:**
   - `hero-video.mp4` (primary format)
   - `hero-video.webm` (optional, for better compression)

2. **Recommended video specifications:**
   - **Duration**: 10-30 seconds (will loop automatically)
   - **Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
   - **File Size**: Under 5MB for optimal performance
   - **Format**: MP4 with H.264 codec
   - **Audio**: Muted (required for autoplay)

## Video Content Suggestions

### Theme: International Education & Study Abroad
- Students studying in modern libraries
- University campuses and buildings
- International students walking on campus
- Graduation ceremonies
- Study abroad destinations (USA, UK, Canada, etc.)
- Academic success moments
- Students with laptops/books
- University lecture halls
- International flags or globe imagery

### Technical Requirements
- **Muted audio** (required for autoplay)
- **Loop seamlessly** (smooth transition from end to beginning)
- **High quality** but optimized file size
- **Mobile-friendly** (test on mobile devices)

## Optimization Tools

### Free Tools:
1. **HandBrake** (https://handbrake.fr/) - Video compression
2. **FFmpeg** (command line) - Advanced video processing
3. **Online converters** - For quick format changes

### HandBrake Settings for Web:
- Preset: Web - Gmail Large 3 Minutes 720p30
- Video Codec: H.264
- Quality: RF 23 (adjust for file size)
- Audio: Disabled (muted)

### FFmpeg Command Example:
```bash
ffmpeg -i input-video.mp4 -c:v libx264 -crf 23 -preset medium -an -movflags +faststart hero-video.mp4
```

## Performance Tips

1. **File Size**: Keep under 5MB for fast loading
2. **Duration**: 10-30 seconds for seamless looping
3. **Resolution**: 1920x1080 or 1280x720
4. **Format**: MP4 primary, WebM secondary
5. **Compression**: Use H.264 codec with CRF 20-25
6. **Mobile**: Test on mobile devices for performance

## Fallback System

The website includes automatic fallbacks:
1. **Primary**: Your custom video
2. **Secondary**: High-quality stock image
3. **Error handling**: Automatic fallback if video fails to load

## Testing Checklist

- [ ] Video loads on desktop
- [ ] Video loads on mobile
- [ ] Video loops smoothly
- [ ] Video is muted
- [ ] Fallback works if video fails
- [ ] Performance is smooth (no lag)
- [ ] File size is under 5MB

## Current Implementation

The hero section now includes:
- ✅ Video background with autoplay, muted, loop
- ✅ Multiple format support (MP4, WebM)
- ✅ Error handling with fallback image
- ✅ Mobile optimization
- ✅ Performance optimizations
- ✅ Accessibility support (reduced motion)
- ✅ Hardware acceleration

