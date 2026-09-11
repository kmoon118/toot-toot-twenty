export function sceneryMarkup({ sun = true, flowers = true } = {}) {
  return `
    <div class="sky"></div>
    ${sun ? '<div class="sun" aria-hidden="true"></div>' : ''}
    <div class="cloud cloud-a" aria-hidden="true"></div>
    <div class="cloud cloud-b" aria-hidden="true"></div>
    <div class="cloud cloud-c" aria-hidden="true"></div>
    <div class="hill hill-left"></div>
    <div class="hill hill-right"></div>
    ${
      flowers
        ? `<div class="flower-row" aria-hidden="true">
            <span class="flower f-pink"></span>
            <span class="flower f-yellow"></span>
            <span class="flower f-blue"></span>
            <span class="flower f-red"></span>
            <span class="flower f-yellow"></span>
            <span class="flower f-pink"></span>
          </div>`
        : ''
    }
  `;
}
