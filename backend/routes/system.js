import express from 'express';
import os from 'os';

const router = express.Router();

router.get('/info', (req, res) => {
  const interfaces = os.networkInterfaces();
  let ipAddress = '127.0.0.1';
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
        break;
      }
    }
  }

  res.json({
    os: `${os.type()} ${os.release()} (${os.arch()})`,
    deviceName: os.hostname(),
    ipAddress: ipAddress,
    platform: os.platform(),
    uptime: os.uptime(),
    memory: {
      total: os.totalmem(),
      free: os.freemem()
    }
  });
});

export default router;
