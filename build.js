// Run: node build.js  -> writes ../site/data.js (encrypted problems) and codes.txt (send codes by email).
// KEEP THIS FILE AND codes.txt PRIVATE. Never upload them to GitHub Pages.
const { webcrypto: c } = require('crypto'); const fs = require('fs');

const TOP = `### ⚠️ SOLUTION FREEDOM
> **AI EXTREME does not prescribe a specific technology or implementation method.**

Participants are expected to identify the core problem, analyse the constraints and develop their own solution.

Teams may implement their solution using:

**Software OR Hardware OR Software + Hardware**

depending on what they believe is appropriate.

Teams may use AI/ML, computer vision, sensors, IoT, robotics, embedded systems, mobile/web applications, simulations, edge computing, or other relevant technologies.

> **The technology is not the challenge. The thinking is.**

`;
const BOTTOM = `
### What will make this problem genuinely challenging?
Every team has the same four-step expectation:

### 1. Identify
**What is the actual problem?**

They shouldn't jump directly to coding.

### 2. Reason
**What information is available, what is missing, and what could go wrong?**

### 3. Design
**What is the most intelligent way to solve it?**

### 4. Demonstrate
**Can your prototype actually show that the idea works?**

> **“Here is a difficult situation. You decide what the real problem is, what information you need, and how AI can help.”**`;

const P = [
['Track 1 — Solar Storm AI','The Invisible Outage',`### Scenario
A powerful solar storm is approaching Earth.

You are responsible for keeping a technology-dependent facility operational. The facility has access to multiple systems such as communication links, electronic equipment, power backup, navigation systems and monitoring devices.

The problem is that **you don't know which system will fail first**.

Some systems may degrade gradually. Others may suddenly become unreliable.

### Challenge
**Design an intelligent system that can detect early signs of technology degradation and decide what should be protected, switched, isolated, or prioritized before a complete failure occurs.**

The system should not merely display an alert.

It should answer questions such as:

> **“What is likely to fail?”**
> **“How serious is the failure?”**
> **“What should we do first?”**

### Creative freedom
Teams may use:

- simulated disturbance data
- sensors
- hardware indicators
- AI prediction
- anomaly detection
- digital twins
- dashboards
- automated switching
- edge AI
- decision-support systems

**Hardware, software, or both are acceptable.**

### Hidden difficulty
The system must deal with **uncertainty and incomplete information**.

The team should demonstrate what happens when some sensors/data sources become unavailable or unreliable.`],
['Track 1 — Solar Storm AI','Storm Mode — Keep It Alive',`### Scenario
A solar storm has disrupted several electronic systems in a remote facility.

You have limited:

- power
- communication
- computing resources
- reliable sensor data

Some devices are still functioning, but you cannot trust everything.

### Challenge
**Design an AI-driven survival strategy that allows a critical system to continue operating under degraded conditions.**

The system should intelligently decide:

> Which functions should continue?
> Which functions can be sacrificed?
> Which devices should receive priority?
> When should the system change its operating strategy?

### Creative possibilities
Students might build:

- intelligent power allocation
- adaptive communication
- fault-tolerant edge AI
- autonomous device prioritization
- predictive shutdown/restart
- hardware switching systems
- AI-based resource management
- a simulated resilient infrastructure

There is **no single correct architecture**.`],
['Track 2 — Communication AI','The Last Connection',`### Scenario
A major emergency has occurred.

The normal communication infrastructure is partially unavailable.

Some phones/devices can communicate. Others cannot.

The available communication channels may include:

- short-range communication
- Wi-Fi
- Bluetooth
- radio
- local networks
- mobile networks
- or other available mechanisms.

However, the system does **not know which communication path will remain reliable**.

### Challenge
**Create an intelligent communication system that keeps critical information moving when normal communication infrastructure becomes unreliable.**

The system should intelligently determine:

> **Who needs to communicate?**
> **What information is most important?**
> **Which available path should be used?**

### Creative freedom
Students can explore:

- intelligent routing
- mesh communication
- priority-based messaging
- edge AI
- hardware communication nodes
- adaptive networks
- emergency messaging applications
- autonomous relay devices

### Important condition
The solution should demonstrate **intelligent adaptation**, not simply send messages from A to B.`],
['Track 2 — Communication AI','Signal or Noise?',`### Scenario
During a large-scale emergency, communication channels become overloaded.

Hundreds or thousands of messages may be generated:

> “I need help.”

> “Road blocked.”

> “Someone is injured.”

> “Water available here.”

> “Building damaged.”

> “False alarm.”

Emergency authorities cannot manually process everything.

### Challenge
**Build an AI system that can determine which incoming information deserves immediate attention and which information can wait.**

The difficult part:

Some messages may be:

- incomplete
- duplicated
- contradictory
- noisy
- outdated
- misleading
- generated from unreliable sources.

### Goal
Create a system capable of converting a chaotic stream of communication into:

**information → credibility → priority → action**

Students can choose software, hardware, or both.`],
['Track 3 — Power Grid AI','One Failure Away',`### Scenario
A small power network contains several interconnected components.

One component begins behaving abnormally.

The problem is:

> **The system does not know whether it is a harmless fluctuation or the beginning of a cascading failure.**

### Challenge
**Develop an intelligent system that detects abnormal behaviour and determines how the network should respond before a small problem becomes a large outage.**

The solution should attempt to answer:

- What is abnormal?
- Where did it originate?
- How dangerous is it?
- What could happen next?
- What action should be taken?

### Creative freedom
Teams may construct:

- a miniature grid
- simulated grid
- sensor-based monitoring
- AI anomaly detection
- predictive models
- intelligent load balancing
- automated switching
- digital twin
- visualization system

The team decides whether hardware is actually necessary.`],
['Track 3 — Power Grid AI','Power for What Matters',`### Scenario
An emergency facility has limited electrical power.

Available power is insufficient for everything.

Several systems demand electricity simultaneously:

- medical equipment
- communication
- lighting
- cooling
- computing
- water systems
- charging stations

A conventional system may simply follow predefined priorities.

### Challenge
**Design an AI system that dynamically decides how limited power should be distributed as conditions change.**

The difficulty is that priorities are not always fixed.

For example:

> A communication system may suddenly become more important because an emergency message arrives.

or

> A medical device may require immediate additional power.

### Goal
Create an intelligent resource allocation system capable of **making and explaining dynamic decisions under constraints**.`],
['Track 4 — GPS & Navigation AI','Where Am I?',`### Scenario
A vehicle, robot, drone, rescue team, or person is operating in an environment where GPS/GNSS suddenly becomes unreliable.

The system knows approximately where it was before the signal disappeared.

After several minutes, however:

> **Where is it now?**

### Challenge
**Develop a navigation or localization system capable of maintaining useful positional awareness when GPS cannot be trusted.**

Students must decide what alternative information can be used.

Possible sources include:

- camera
- IMU
- maps
- landmarks
- Bluetooth
- Wi-Fi
- nearby devices
- environmental signals
- motion patterns
- previously collected data

But students are **not required to use any particular technology**.

### Creative challenge
The system should demonstrate how it handles **accumulating uncertainty**.

Simply showing a fixed location after GPS failure would not be sufficient.`],
['Track 4 — GPS & Navigation AI','The Wrong Turn',`### Scenario
A navigation system is operating during an emergency.

GPS is unavailable or unreliable.

The system still has a map, but the map itself may no longer represent reality.

For example:

- a road may be blocked
- a bridge may be damaged
- an area may become dangerous
- normal routes may become inaccessible.

### Challenge
**Create an intelligent navigation system that can recognize when the “best route” is no longer actually the best route and adapt its recommendation.**

The system should reason about:

**Location + environment + uncertainty + risk + destination**

rather than simply finding the shortest path.

### Creative freedom
Teams may build:

- software navigation systems
- computer vision-based navigation
- autonomous robots
- sensor-based navigation
- risk-aware route planning
- simulation environments
- physical prototypes`],
['Track 5 — Disaster Response AI','The First 15 Minutes',`### Scenario
A disaster has just occurred.

The response team receives incomplete information from different sources.

For example:

- camera images
- citizen reports
- sensors
- drone observations
- emergency messages
- map information
- environmental measurements

But the information is arriving **faster than humans can analyse it**.

### Challenge
**Design an AI-assisted disaster response system that helps decision-makers determine what should be investigated or acted upon first.**

The system should answer:

> **Where is the greatest immediate risk?**

> **What information is reliable?**

> **Which situation requires the fastest response?**

> **What resources should be sent first?**

### Creative freedom
Teams could develop:

- AI decision-support
- computer vision
- drones
- sensor networks
- emergency dashboards
- risk maps
- resource allocation
- rescue robots
- multimodal AI

The implementation can be entirely software, hardware, or hybrid.`],
['Track 5 — Disaster Response AI','When the Map Becomes Wrong',`### Scenario
A major disaster has changed the physical environment.

The map available to emergency responders represents the area **before the disaster**.

After the event:

- roads may disappear
- buildings may collapse
- water may cover areas
- debris may block routes
- safe zones may change
- communication infrastructure may disappear.

### Challenge
**Build an intelligent system that helps responders understand how the environment has changed and make better decisions using the available information.**

The system does not necessarily have to create a complete map.

Instead, teams should identify a **critical information gap** and solve it.

For example:

> “Which roads are probably still usable?”

> “Where should rescue resources be deployed?”

> “Which areas have changed significantly?”

> “Which information should responders trust?”

### Creative freedom
Possible approaches include:

- computer vision
- drone imagery
- satellite imagery
- IoT sensors
- robotics
- GIS
- AI-generated risk maps
- crowdsourced information
- multimodal AI

Again, **these are possibilities, not requirements**.`]];

const AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789@#$%&*';
const mk = () => 'AIEX' + [...c.getRandomValues(new Uint8Array(9))].map(x => AL[x % AL.length]).join('');
const b64 = u => Buffer.from(u).toString('base64');
async function enc(code, obj) {
  const salt = c.getRandomValues(new Uint8Array(16)), iv = c.getRandomValues(new Uint8Array(12));
  const km = await c.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveKey']);
  const k = await c.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ct = new Uint8Array(await c.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(JSON.stringify(obj))));
  return b64(Buffer.concat([salt, iv, ct]));
}
(async () => {
  const codes = new Set(); while (codes.size < 10) codes.add(mk());
  const list = [...codes], blobs = [], lines = [];
  for (let i = 0; i < 10; i++) {
    blobs.push(await enc(list[i], { n: i + 1, track: P[i][0], title: P[i][1], body: TOP + P[i][2] + '\n' + BOTTOM }));
    lines.push(`Problem ${i + 1} (${P[i][1]}): ${list[i]}`);
  }
  blobs.sort(() => Math.random() - .5);
  fs.writeFileSync(__dirname + '/../site/data.js', 'window.AIEX_DATA=' + JSON.stringify(blobs) + ';\n');
  fs.writeFileSync(__dirname + '/codes.txt', lines.join('\n') + '\n');
  console.log(lines.join('\n'));
})();
