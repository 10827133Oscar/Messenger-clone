import AuthForm from '@/components/AuthForm';

export default function Home() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <svg
          className="mx-auto h-12 w-12"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="24" r="24" fill="url(#gradient)" />
          <path
            d="M24 10C16.268 10 10 15.732 10 22.8C10 26.784 11.912 30.312 14.88 32.64V38L20.016 35.136C21.288 35.472 22.62 35.64 24 35.64C31.732 35.64 38 29.868 38 22.8C38 15.732 31.732 10 24 10ZM25.2 27.6L21.6 23.76L14.64 27.6L22.32 19.44L26.04 23.28L32.88 19.44L25.2 27.6Z"
            fill="white"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="48" x2="48" y2="0">
              <stop stopColor="#0099FF" />
              <stop offset="1" stopColor="#A033FF" />
            </linearGradient>
          </defs>
        </svg>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  );
}
