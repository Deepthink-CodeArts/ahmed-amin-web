# YouTube Shorts Integration Guide

## How to Add Your YouTube Shorts Videos

### 1. **Get YouTube Shorts Video IDs**

To get the YouTube Shorts video ID:
1. Open your YouTube Shorts video
2. Copy the URL (e.g., `https://www.youtube.com/shorts/ABC123DEF456`)
3. Extract the video ID: `ABC123DEF456`

### 2. **Update the Video Data**

In `/src/pages/Home.tsx`, find the `successVideos` array and replace the placeholder YouTube IDs:

```javascript
const successVideos = [
  {
    id: '1',
    title: 'Harvard Success Story',
    student: 'Rahul Ahmed',
    university: 'Harvard University, USA',
    youtubeId: 'YOUR_ACTUAL_YOUTUBE_ID_HERE', // Replace this
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    duration: '0:45'
  },
  // ... add more videos
];
```

### 3. **Video Specifications**

For optimal display, your YouTube Shorts should be:
- **Aspect Ratio**: 9:16 (vertical)
- **Duration**: 15-60 seconds
- **Quality**: 1080p or 720p
- **Content**: Student success stories, testimonials, university experiences

### 4. **Thumbnail Images**

Replace the placeholder thumbnail URLs with:
- **High-quality images** of the students
- **Aspect ratio**: 3:4 (portrait)
- **Size**: 300x400px minimum
- **Format**: JPG or PNG

### 5. **Adding More Videos**

To add more videos to the carousel:

```javascript
{
  id: '7', // Next number
  title: 'Your Video Title',
  student: 'Student Name',
  university: 'University Name',
  youtubeId: 'YOUR_YOUTUBE_ID',
  thumbnail: 'https://your-image-url.com/image.jpg',
  duration: '0:30'
}
```

### 6. **Video Content Suggestions**

Create YouTube Shorts featuring:
- **Student testimonials** (30-60 seconds)
- **University campus tours** (15-30 seconds)
- **Success story highlights** (30-45 seconds)
- **Study abroad journey** (45-60 seconds)
- **University acceptance reactions** (15-30 seconds)

### 7. **YouTube Shorts Best Practices**

- **Hook viewers** in the first 3 seconds
- **Keep it vertical** (9:16 aspect ratio)
- **Add captions** for accessibility
- **Use trending hashtags** (#StudyAbroad #SuccessStory)
- **Include call-to-action** (Visit Aro Global Studies)

### 8. **Current Implementation Features**

✅ **Auto-rotating carousel** (4-second intervals)
✅ **Click to play** (opens YouTube Shorts)
✅ **Thumbnail navigation** (click to switch videos)
✅ **Navigation dots** (visual indicators)
✅ **Mobile responsive** design
✅ **Smooth animations** and transitions
✅ **Video info overlay** (title, student, university, duration)
✅ **Star ratings** display

### 9. **Testing Your Videos**

After adding your YouTube IDs:
1. **Test video playback** by clicking the play button
2. **Verify thumbnails** load correctly
3. **Check mobile responsiveness**
4. **Test carousel navigation**
5. **Ensure videos open** in new tabs

### 10. **Example Video Data**

```javascript
const successVideos = [
  {
    id: '1',
    title: 'From Dhaka to Harvard',
    student: 'Rahul Ahmed',
    university: 'Harvard University, USA',
    youtubeId: 'dQw4w9WgXcQ', // Replace with real ID
    thumbnail: '/images/students/rahul-ahmed.jpg',
    duration: '0:45'
  },
  {
    id: '2',
    title: 'Oxford Dreams Come True',
    student: 'Fatima Khan',
    university: 'Oxford University, UK',
    youtubeId: 'dQw4w9WgXcQ', // Replace with real ID
    thumbnail: '/images/students/fatima-khan.jpg',
    duration: '0:52'
  }
  // Add more videos...
];
```

## Next Steps

1. **Create your YouTube Shorts** with student success stories
2. **Upload to YouTube** and get the video IDs
3. **Update the video data** in Home.tsx
4. **Add custom thumbnails** for each video
5. **Test the carousel** functionality
6. **Optimize video content** for engagement

The carousel will automatically loop through all videos and provide an engaging way to showcase student success stories! 🎉
