document.addEventListener('DOMContentLoaded', () => {
    const dailyTitle = document.querySelector('.font-newsreader.text-\\[var\\(--primary-color\\)\\]');
    const dailySource = document.querySelector('.text-gray-500.text-sm');
    const dailyImage = document.querySelector('.bg-center.bg-no-repeat.aspect-square.bg-cover.rounded-lg.size-16.shrink-0.shadow-lg');
    const learningImages = document.querySelectorAll('.w-24.h-20.bg-center.bg-no-repeat.bg-cover.rounded-lg.shrink-0');
    const dailyGoalProgress = document.querySelector('.h-2\\.5.rounded-full.bg-\\[var\\(--secondary-color\\)\\]');
    const dailyGoalPercentage = document.querySelector('.text-gray-500.text-sm.font-medium.leading-normal');

    async function fetchContent() {
        try {
            const response = await fetch('data/content.json');
            if (!response.ok) {
                throw new Error('Failed to fetch content.json');
            }
            const content = await response.json();
            return content;
        } catch (error) {
            console.error('Error fetching content:', error);
            return [];
        }
    }

    function renderDailyContent(content) {
        if (content.length > 0) {
            const dailyContent = content[0]; // For now, just use the first item
            if (dailyTitle) {
                dailyTitle.textContent = dailyContent.title;
            }
            if (dailySource) {
                dailySource.textContent = dailyContent.source;
            }
            if (dailyImage && dailyContent.image) {
                dailyImage.style.backgroundImage = `url('${dailyContent.image}')`;
            }

            if(learningImages.length >= 3) {
                learningImages[0].style.backgroundImage = `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbg8tZf9k0b8bYfoF2kH_hAoC4i-a9l3O2-6mfuuB_KjbJSxZumy4l3me5Vthum7lHHpojx9XEAPL4N0WwJ3TilJfVSrW8LqxOaHVxqCLWZbUSXqMKFFa0I1xhJMINub1qtnGBJpV82XdA8wLIHB3EDBUOtLBwDnrdywq4grW77fNdTW9kmbzU9iosxoCn6T36IpLs78IqQlhvHxjlNECRrl4Y5uueq6VM4-Xri41k5E0UTPmqxq7HFkS25h9kJwc5db8X6yzabA')`;
                learningImages[1].style.backgroundImage = `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDTWnJKJQLWnJQyGVqt7fyFCYBvWuUp97dtgTGBqmiklxIHFzZK4vRaPx6pbm7RSlab-SM9iw1Px7mD0BEXg9Ev01JA04fUjK_86redNlOtNPpjrfqBcwUBOVboErq5uTUmCEYInZ1wfBQS1ZsZ0Lr331XUDpB3SQczBrNs3WMr10s_uqHEzKsK0LMQT9RbJmnDhhA_QSV8-r6Aq3xYikZdP8QsNLJV6Yj_jiopJtTTAVIHmvOwAjp_SU9b-Qi_0_h8RrUmCx5iw')`;
                learningImages[2].style.backgroundImage = `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5tt120y6dVMtzPhvNOs1sQEG6_fNBUeetluFNtRmnBI8u7uCK9I_MZmD7kOqDhb1dI9WCJJSInD7lQSZHoToKOJlKbqSiikFfSBrFeGojoVVopAcPWgqYiAyg7zfNN7cTmbiSBi922HcjkfYLVIzTzW9DIgcnelDwWHIhL8UJidDQM0NmcNoumZoAweUSctp8kXrZEQOfmpoYFHfCp-_DjDAXpMw6gyQiZcQ_FL0G58Ey0jMcEGqAT3jv7370VevNbCDVz9fqdA')`;
            }
        }
    }

    function updateProgress() {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        const dailyGoal = goals.find(goal => goal.frequency === 'Daily' && goal.type === 'Learn new words');

        if (dailyGoal) {
            const learnedWords = JSON.parse(localStorage.getItem('learnedWords')) || [];
            const progress = Math.min(100, (learnedWords.length / dailyGoal.number) * 100);
            if (dailyGoalProgress) {
                dailyGoalProgress.style.width = `${progress}%`;
            }
            if (dailyGoalPercentage) {
                dailyGoalPercentage.textContent = `${Math.floor(progress)}%`;
            }
        }
    }

    async function init() {
        const content = await fetchContent();
        renderDailyContent(content);
        updateProgress();
    }

    init();
});
