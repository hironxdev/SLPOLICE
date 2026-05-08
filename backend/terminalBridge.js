import { Server } from "socket.io";
import os from "os";
import pty from "node-pty";

export function setupTerminal(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust for production security
      methods: ["GET", "POST"]
    }
  });

  const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

  io.on("connection", (socket) => {
    console.log("[Cyber Terminal] Officer Secure Link Established:", socket.id);

    // Create a new pseudo-terminal for each session
    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: process.env.HOME || process.cwd(),
      env: {
        ...process.env,
        TERM: "xterm-256color",
        COLORTERM: "truecolor"
      }
    });

    // Inject Kali Prompt Simulation if on Windows
    if (os.platform() === "win32") {
      setTimeout(() => {
        ptyProcess.write(`function prompt { "┌──(root㉿kali)-[$(Get-Location)]\`n└─# " }; Clear-Host\r`);
      }, 500);
    }

    // Send terminal output to the client
    ptyProcess.onData((data) => {
      socket.emit("output", data);
    });

    // Receive terminal input from the client
    socket.on("input", (data) => {
      ptyProcess.write(data);
    });

    // Handle terminal resize
    socket.on("resize", ({ cols, rows }) => {
      ptyProcess.resize(cols, rows);
    });

    socket.on("disconnect", () => {
      console.log("[Cyber Terminal] Link Terminated:", socket.id);
      ptyProcess.kill();
    });
  });

  console.log("✅ CSEU Cyber Command Terminal Bridge Ready.");
}
