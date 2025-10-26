import React from "react";
import LiquidGlass from "../../../fundamentalComponents/LiquidGlass";


export default function App0() {
    const [st, setSt] = React.useState(false);
    const toggle = () => {
        setSt(!st);
        console.log(st);
    };
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '2rem' }}>
<LiquidGlass as="button" onClick={() => alert('Clicked!')} colorScheme="lightGray">
  Click Me
</LiquidGlass>

<LiquidGlass as="input" type="text" name="username" placeholder="Enter name" autoComplete="off" />

<LiquidGlass as="a" href="https://example.com" target="_blank">
  Visit Site
</LiquidGlass>

<LiquidGlass as="img" src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="Logo" width={120} />

<LiquidGlass as="div" role="alert">
  Custom alert box!
</LiquidGlass>
    </div>
  );
}