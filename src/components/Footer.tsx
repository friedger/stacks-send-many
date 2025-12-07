export function Footer() {
  return (
    <footer
      className="bg-dark text-white text-center w-80 mb-0 p-5"
      style={{ position: 'relative' }}
    >
      <a href="https://github.com/friedger/stacks-send-many">
        <img
          width="149"
          height="149"
          style={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}
          src="/forkme_right_white_ffffff.webp"
          className="attachment-full size-full"
          alt="Fork me on GitHub"
        />
      </a>
      <p>
        Send Many is free and{' '}
        <a
          href="https://github.com/friedger/stacks-send-many"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Source
        </a>{' '}
        available on github.{' '}
      </p>
    </footer>
  );
}
