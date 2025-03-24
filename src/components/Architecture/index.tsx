/**
 * Architecture component rendering an SVG diagram.
 * This component displays a structured graphical representation.
 *
 * @returns {JSX.Element} The SVG architecture visualization.
 */
const Architecture = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 715 910"
    fill="none"
    className=""
  >
    <rect
      width={229}
      height={126}
      x={223.5}
      y={349.5}
      fill="#171921"
      stroke="#171921"
      rx={7.5}
    />

    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M260 397h157v31H260z" />
      </clipPath>
      <clipPath id="b">
        <path fill="#fff" d="M617 386h24v24h-24z" />
      </clipPath>
      <clipPath id="c">
        <path fill="#fff" d="M71 425h24v24H71z" />
      </clipPath>
      <clipPath id="d">
        <path fill="#fff" d="M336 776h24v24h-24z" />
      </clipPath>
      <clipPath id="e">
        <path fill="#fff" d="M587 776h24v24h-24z" />
      </clipPath>
    </defs>
  </svg>
);

export default Architecture;
