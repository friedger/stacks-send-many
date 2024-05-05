declare interface BigInt {
  toJSON(): string;
}
declare module 'punycode2/to-unicode' {
  toUnicode: (str: string) => string;
  export default toUnicode;
}
declare module 'punycode2/to-ascii' {
  toAscii: (str: string) => string;
  export default toAscii;
}
declare module 'react-download-link' {
  import { type Component } from 'react';

  interface DownloadLinkProps {
    filename?: string;
    label?: string | number | JSX.Element;
    className?: string;
    style?: CSSProperties;
    tagName?: string;
    exportFile?(type?: string): void;
  }

  declare class DownloadBtn extends Component<DownloadLinkProps> {}

  export default DownloadBtn;
}
