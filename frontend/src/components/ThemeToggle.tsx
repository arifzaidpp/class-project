import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

interface ThemeToggleProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

function ThemeToggle({ darkMode, setDarkMode }: ThemeToggleProps) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <SunIcon className="h-6 w-6 text-yellow-500" />
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-700" />
      )}
    </button>
  )
}

export default ThemeToggle