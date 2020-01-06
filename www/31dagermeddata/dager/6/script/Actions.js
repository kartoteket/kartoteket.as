L.Control.Actions = L.Control.extend({
  options: {
    position: 'topright'
  },
  initialize: function (options) {
    L.Util.setOptions(this, options);
  },

  onAdd: function (map) {
    // const legend = L.DomUtil.create('div', 'legend');
    const container = L.DomUtil.create('div', 'actions-container');
    const actions = L.DomUtil.create('div', 'actions', container);
    actions.innerHTML = `<div class="actions__title">Hva skjer med kysten vår om temperaturene fortsetter å øke?</div>
      <div class="actions__name">Årstall:</div>
      <a class="activebutton" id="activeYear" onclick="setYear(2020, this)" href="#" >i dag</a>
      <a class="inactivebutton" onclick="setYear(2060, this)" href="#" >2060</a>
      <a class="inactivebutton" onclick="setYear(2100, this)" href="#" >2100</a>
      <div class="actions__name">Vekst i utslipp:</div>
      <a class="inactivebutton" onclick="setScenario('high', this)" href="#" >Høyt</a>
      <a class="activebutton"  id="activeScenario" onclick="setScenario('low', this)" href="#" >Lavt</a>
      
    `;
    console.log('container', actions);

    return container;
  },

  onRemove: function (map) {
    console.log('removing', map);
  },
});

// @factory L.control.legend(options?: Control.Layers options)
// Creates an attribution control with the given layers. Overlays will be switched with checkboxes. Note that all base layers should be passed in the base layers object, but only one should be added to the map during map instantiation.
L.control.actions = function (options) {
  return new L.Control.Actions(options);
};
