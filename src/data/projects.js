// Project page data
// Add video, screenshots, and correct GitHub URLs here when ready

const projects = {
  "js-presenter": {
    slug:        "js-presenter",
    name:        "JS Presenter",
    tagline:     "A browser-based presentation framework built for React components.",
    description: "JS Presenter is a lightweight presentation tool that runs entirely in the browser. Build your slides as React components, and let JS Presenter handle the rest. Perfect for developers who want to create interactive, code-driven presentations without leaving their development environment.",
    tags:        ["JavaScript", "React", "CSS", "HTML", "Tailwind", "Vite"],
    github:      "https://github.com/OrkoTheMage/js-presenter",
    liveUrl:     null,
    video:       null,      // replace with a YouTube/Vimeo embed URL when ready
    localVideo:  '/projects/js-presenter/demo.mp4',
    screenshots: [
      { src: '/projects/js-presenter/screenshot-1.png', alt: 'JS Presenter screenshot 1' },
      { src: '/projects/js-presenter/screenshot-2.png', alt: 'JS Presenter screenshot 2' },
      { src: '/projects/js-presenter/screenshot-3.png', alt: 'JS Presenter screenshot 3' },
      { src: '/projects/js-presenter/screenshot-4.png', alt: 'JS Presenter screenshot 4' },
      { src: '/projects/js-presenter/screenshot-5.png', alt: 'JS Presenter screenshot 5' },
      { src: '/projects/js-presenter/screenshot-6.png', alt: 'JS Presenter screenshot 6' },
      { src: '/projects/js-presenter/screenshot-7.png', alt: 'JS Presenter screenshot 7' },
      { src: '/projects/js-presenter/screenshot-8.png', alt: 'JS Presenter screenshot 8' },
      { src: '/projects/js-presenter/screenshot-9.png', alt: 'JS Presenter screenshot 9' },
    ],
  },

  "cli-presenter": {
    slug:        "cli-presenter",
    name:        "CLI Presenter",
    tagline:     "Give presentations directly from your terminal.",
    description: "CLI Presenter, with libraries like Blessed and chalk, allows you to create and deliver presentations right from your terminal. Perfect for developers who want to stay in their coding environment while presenting, or for those who want a unique, retro-style presentation experience.",
    tags:        ["JavaScript", "CLI", "Node.js", "ASCII"],
    github:      "https://github.com/OrkoTheMage/cli-presenter",
    liveUrl:     null,
    video:       null,
    localVideo:  '/projects/cli-presenter/demo.mp4',
    screenshots: [
      { src: '/projects/cli-presenter/screenshot-1.png', alt: 'CLI Presenter screenshot 1' },
      { src: '/projects/cli-presenter/screenshot-2.png', alt: 'CLI Presenter screenshot 2' },
      { src: '/projects/cli-presenter/screenshot-3.png', alt: 'CLI Presenter screenshot 3' },
      { src: '/projects/cli-presenter/screenshot-4.png', alt: 'CLI Presenter screenshot 4' },
      { src: '/projects/cli-presenter/screenshot-5.png', alt: 'CLI Presenter screenshot 5' },
      { src: '/projects/cli-presenter/screenshot-6.png', alt: 'CLI Presenter screenshot 6' },
    ],
  },

  "orkos-todo-tool": {
    slug:        "orkos-todo-tool",
    name:        "Orko's Todo Tool",
    tagline:     "A no-nonsense task manager built for developers",
    description: "A focused todo tool with a clean interface, persistent storage, and keyboard-first design. Built to stay out of your way while keeping your tasks in order.",
    tags:        ["Python", "CLI", "Local Storage", "ASCII"],
    github:      "https://github.com/OrkoTheMage/orkos-todo-tool",
    liveUrl:     null,
    video:       null,
    localVideo:  '/projects/orkos-todo-tool/demo.mp4',
    screenshots: [
      { src: '/projects/orkos-todo-tool/screenshot-1.png', alt: "Orko's Todo Tool screenshot 1" },
      { src: '/projects/orkos-todo-tool/screenshot-2.png', alt: "Orko's Todo Tool screenshot 2" },
      { src: '/projects/orkos-todo-tool/screenshot-3.png', alt: "Orko's Todo Tool screenshot 3" },
      { src: '/projects/orkos-todo-tool/screenshot-4.png', alt: "Orko's Todo Tool screenshot 4" },
    ],
  },

  "cli-system-fetch": {
    slug:        "cli-system-fetch",
    name:        "CLI System Fetch",
    tagline:     "A custom-coded API system for fetching and displaying system info",
    description: "A fully custom implementation of the classic neofetch system info tool. Features a personalized ASCII logo, custom system information, and enhanced formatting options. Built from scratch to understand how these tools work under the hood.",
    tags:        ["Python", "CLI", "ASCII", "neofetch"],
    github:      "https://github.com/OrkoTheMage/cli-system-fetch",
    liveUrl:     null,
    localVideo:  '/projects/cli-system-fetch/demo.mp4',
    screenshots: [
      { src: '/projects/cli-system-fetch/screenshot-1.png', alt: "CLI System Fetch screenshot 1" },
      { src: '/projects/cli-system-fetch/screenshot-2.png', alt: "CLI System Fetch screenshot 2" },
      { src: '/projects/cli-system-fetch/screenshot-3.png', alt: "CLI System Fetch screenshot 3" },
    ],
  },
}

export default projects
