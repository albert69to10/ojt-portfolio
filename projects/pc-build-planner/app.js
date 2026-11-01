// PC Build Planner
// Sample parts list with simplified specs. Prices are sample peso amounts.
var PARTS = {
  cpu: {
    label: "Processor (CPU)",
    items: [
      { name: "AMD Ryzen 5 5600", socket: "AM4", watts: 65, price: 6500 },
      { name: "AMD Ryzen 5 7600", socket: "AM5", watts: 65, price: 11500 },
      { name: "Intel Core i3-12100F", socket: "LGA1700", watts: 58, price: 4800 },
      { name: "Intel Core i5-12400F", socket: "LGA1700", watts: 65, price: 7200 }
    ]
  },
  mobo: {
    label: "Motherboard",
    items: [
      { name: "B550M (AM4, DDR4)", socket: "AM4", ram: "DDR4", watts: 40, price: 5800 },
      { name: "B650M (AM5, DDR5)", socket: "AM5", ram: "DDR5", watts: 45, price: 9500 },
      { name: "H610M (LGA1700, DDR4)", socket: "LGA1700", ram: "DDR4", watts: 35, price: 4500 },
      { name: "B760M (LGA1700, DDR5)", socket: "LGA1700", ram: "DDR5", watts: 40, price: 7800 }
    ]
  },
  ram: {
    label: "Memory (RAM)",
    items: [
      { name: "16GB (2x8) DDR4 3200", ram: "DDR4", watts: 6, price: 2400 },
      { name: "32GB (2x16) DDR4 3200", ram: "DDR4", watts: 8, price: 4300 },
      { name: "16GB (2x8) DDR5 5600", ram: "DDR5", watts: 8, price: 3500 },
      { name: "32GB (2x16) DDR5 6000", ram: "DDR5", watts: 10, price: 6200 }
    ]
  },
  gpu: {
    label: "Graphics card (GPU)",
    items: [
      { name: "None (use integrated graphics)", watts: 0, price: 0, none: true },
      { name: "GTX 1650 4GB", watts: 75, price: 8500 },
      { name: "RTX 3060 12GB", watts: 170, price: 17500 },
      { name: "RX 7600 8GB", watts: 165, price: 16000 },
      { name: "RTX 4070 12GB", watts: 200, price: 36000 }
    ]
  },
  storage: {
    label: "Storage",
    items: [
      { name: "500GB NVMe SSD", watts: 5, price: 2300 },
      { name: "1TB NVMe SSD", watts: 6, price: 3800 },
      { name: "1TB SATA SSD + 1TB HDD", watts: 12, price: 5200 }
    ]
  },
  psu: {
    label: "Power supply (PSU)",
    items: [
      { name: "450W 80+ Bronze", capacity: 450, price: 2200 },
      { name: "550W 80+ Bronze", capacity: 550, price: 2900 },
      { name: "650W 80+ Gold", capacity: 650, price: 4500 },
      { name: "750W 80+ Gold", capacity: 750, price: 5600 }
    ]
  }
};

var EXTRA_WATTS = 50; // fans, USB devices, peripherals
var form = document.getElementById("build");
var peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

Object.keys(PARTS).forEach(function (key) {
  var part = PARTS[key];
  var div = document.createElement("div");
  div.className = "part";
  var options = part.items.map(function (it, i) {
    return '<option value="' + i + '">' + it.name + "</option>";
  }).join("");
  div.innerHTML =
    '<label for="' + key + '">' + part.label + "</label>" +
    '<select id="' + key + '" name="' + key + '">' + options + "</select>" +
    '<div class="meta" id="' + key + '-meta"></div>';
  form.appendChild(div);
});

// Start with a balanced example build.
document.getElementById("cpu").value = "0";
document.getElementById("mobo").value = "0";
document.getElementById("gpu").value = "2";
document.getElementById("storage").value = "1";
document.getElementById("psu").value = "1";

function pick(key) {
  return PARTS[key].items[Number(document.getElementById(key).value)];
}

function update() {
  var b = {};
  Object.keys(PARTS).forEach(function (k) { b[k] = pick(k); });

  var watts = b.cpu.watts + b.mobo.watts + b.ram.watts + b.gpu.watts + b.storage.watts + EXTRA_WATTS;
  var recommended = Math.ceil((watts * 1.4) / 50) * 50; // 40% headroom, rounded up to 50 W
  var cost = Object.keys(b).reduce(function (sum, k) { return sum + b[k].price; }, 0);

  Object.keys(b).forEach(function (k) {
    var it = b[k];
    var meta = k === "psu" ? it.capacity + " W capacity" : (it.watts ? it.watts + " W" : "0 W");
    document.getElementById(k + "-meta").textContent = meta + " · " + peso.format(it.price);
  });

  document.getElementById("watts").textContent = watts + " W";
  document.getElementById("psu-rec").textContent = recommended + " W or higher";
  document.getElementById("cost").textContent = peso.format(cost);

  var checks = [];
  checks.push(b.cpu.socket === b.mobo.socket
    ? ["ok", "CPU and motherboard both use " + b.cpu.socket + "."]
    : ["bad", "Socket mismatch: CPU is " + b.cpu.socket + " but the motherboard is " + b.mobo.socket + "."]);
  checks.push(b.ram.ram === b.mobo.ram
    ? ["ok", "RAM type " + b.ram.ram + " matches the motherboard."]
    : ["bad", "RAM mismatch: the motherboard needs " + b.mobo.ram + " but you picked " + b.ram.ram + "."]);
  if (b.psu.capacity >= recommended) {
    checks.push(["ok", "The " + b.psu.capacity + " W PSU covers the recommended " + recommended + " W."]);
  } else if (b.psu.capacity >= watts) {
    checks.push(["warn", "The PSU covers the load but has little headroom. Use " + recommended + " W or more."]);
  } else {
    checks.push(["bad", "The PSU is too weak for an estimated " + watts + " W load."]);
  }
  if (b.gpu.none && /F$/.test(b.cpu.name)) {
    checks.push(["bad", b.cpu.name + " has no integrated graphics. Add a graphics card."]);
  }

  document.getElementById("checks").innerHTML = checks.map(function (c) {
    return '<li class="' + c[0] + '">' + c[1] + "</li>";
  }).join("");
}

form.addEventListener("change", update);
update();
