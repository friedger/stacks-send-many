export default function DocumentationLink({ docLink }) {
    return (
        <a
          className="primary-link"
          target="_blank"
          rel="noreferrer"
          href={docLink}
        >
          <i className="bi bi-question-circle"></i>
        </a>
    )
}