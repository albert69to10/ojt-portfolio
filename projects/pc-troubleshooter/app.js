// PC Troubleshooting Assistant
// Each symptom has an ordered list of checks, from simplest to most involved.
var GUIDES = [
  {
    id: "no-power", name: "No power", category: "Power",
    steps: [
      ["Check the wall outlet", "Plug in another device to confirm the outlet works."],
      ["Check the power cable and PSU switch", "Reseat the cable and make sure the PSU switch is set to I (on)."],
      ["Check the front panel connector", "Confirm the power switch pins are on the correct motherboard header."],
      ["Check the 24-pin and CPU 8-pin cables", "Reseat both connectors firmly on the motherboard."],
      ["Test the power supply", "Use a PSU tester or the paperclip test to confirm the PSU turns on."]
    ]
  },
  {
    id: "no-display", name: "No display", category: "Display",
    steps: [
      ["Check the monitor", "Confirm it is on and set to the correct input source."],
      ["Check the video cable", "Plug the cable into the graphics card, not the motherboard port."],
      ["Reseat the RAM", "Remove each stick, clean the contacts, and reinstall it firmly."],
      ["Reseat the graphics card", "Remove and reinstall the GPU, and connect its PCIe power cables."],
      ["Clear the CMOS", "Remove the CMOS battery for 5 minutes or use the clear-CMOS jumper."]
    ]
  },
  {
    id: "beep", name: "Beep codes on startup", category: "POST",
    steps: [
      ["Count the beeps", "Write down the pattern of long and short beeps."],
      ["Look up the code", "Check the motherboard manual for its BIOS beep code table."],
      ["Test one RAM stick at a time", "Most beep codes point to memory problems."],
      ["Check the CPU and cooler", "Confirm the cooler is mounted and the CPU fan is connected."]
    ]
  },
  {
    id: "overheat", name: "Overheating / shuts down", category: "Cooling",
    steps: [
      ["Check temperatures", "Use the BIOS or a monitoring tool to read CPU and GPU temperatures."],
      ["Check the fans", "Confirm every case, CPU and GPU fan spins."],
      ["Clean the dust", "Blow out the heatsinks, filters and fans with compressed air."],
      ["Replace the thermal paste", "Clean old paste off the CPU and apply a pea-sized amount."],
      ["Improve airflow", "Arrange the fans as front intake and rear/top exhaust."]
    ]
  },
  {
    id: "slow", name: "Slow performance", category: "System",
    steps: [
      ["Check Task Manager", "Find which process uses high CPU, memory or disk."],
      ["Disable startup apps", "Turn off unneeded programs in the Startup tab."],
      ["Check free storage", "Keep at least 15% of the system drive free."],
      ["Scan for malware", "Run a full scan with Windows Security."],
      ["Check drive health", "Use CrystalDiskInfo to read the drive's SMART status."]
    ]
  },
  {
    id: "no-internet", name: "No internet", category: "Network",
    steps: [
      ["Check the cable or Wi-Fi", "Confirm the Ethernet link light or the Wi-Fi connection."],
      ["Restart the router", "Unplug it for 30 seconds, then plug it back in."],
      ["Run ipconfig", "Look for a valid IP address and default gateway."],
      ["Ping the gateway, then 8.8.8.8", "This shows whether the problem is local or with the ISP."],
      ["Reset the network stack", "Run: ipconfig /release, ipconfig /renew, ipconfig /flushdns."]
    ]
  }
];

var listEl = document.getElementById("symptoms");
var stepsEl = document.getElementById("steps");
var current = null;

function renderList() {
  GUIDES.forEach(function (g) {
    var li = document.createElement("li");
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = g.name;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () { select(g.id); });
    b.dataset.id = g.id;
    li.appendChild(b);
    listEl.appendChild(li);
  });
}

function select(id) {
  current = GUIDES.find(function (g) { return g.id === id; });
  listEl.querySelectorAll("button").forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.dataset.id === id));
  });
  document.getElementById("title").textContent = current.name;
  document.getElementById("category").textContent = current.category;

  stepsEl.innerHTML = "";
  current.steps.forEach(function (s, i) {
    var li = document.createElement("li");
    li.innerHTML =
      '<label><input type="checkbox" id="step-' + i + '">' +
      "<span><strong>" + s[0] + "</strong><small>" + s[1] + "</small></span></label>";
    stepsEl.appendChild(li);
  });
  updateProgress();
}

function updateProgress() {
  var boxes = stepsEl.querySelectorAll("input");
  var done = stepsEl.querySelectorAll("input:checked").length;
  document.getElementById("count").textContent = done + " / " + boxes.length;
  document.getElementById("fill").style.width = boxes.length ? (done / boxes.length) * 100 + "%" : "0";
  document.getElementById("done").hidden = !(boxes.length && done === boxes.length);
}

stepsEl.addEventListener("change", updateProgress);
document.getElementById("reset").addEventListener("click", function () {
  stepsEl.querySelectorAll("input").forEach(function (b) { b.checked = false; });
  updateProgress();
});

renderList();
select("no-display");
