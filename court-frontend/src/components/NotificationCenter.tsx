"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  X,
  AlertTriangle,
  Info,
  ShieldAlert,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export type SecurityNotification = {
  id: string;
  type: "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<SecurityNotification[]>(
    [],
  );

  useEffect(() => {
    // Initialize with sample data after mount to avoid hydration/render purity issues
    setNotifications([
      {
        id: "1",
        type: "CRITICAL",
        title: "Unauthorized Access Attempt",
        message:
          "Multiple failed login attempts detected from IP 123.231.44.12",
        timestamp: new Date(),
        read: false,
      },
      {
        id: "2",
        type: "WARNING",
        title: "Compliance Audit Pending",
        message: "Wireless module scan has not been performed in 24 hours.",
        timestamp: new Date(Date.now() - 3600000),
        read: false,
      },
    ]);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTypeStyles = (type: SecurityNotification["type"]) => {
    switch (type) {
      case "CRITICAL":
        return {
          icon: ShieldAlert,
          color: "text-rose-600",
          bg: "bg-rose-50",
          border: "border-rose-100",
        };
      case "WARNING":
        return {
          icon: AlertTriangle,
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
        };
      case "SUCCESS":
        return {
          icon: CheckCircle2,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
        };
      default:
        return {
          icon: Info,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
        };
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-rose-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-96 bg-white border border-slate-200 rounded-[32px] shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Security Alerts
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {unreadCount} Unread Notifications
                </p>
              </div>
              <button
                onClick={markAllRead}
                className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                Mark all read
              </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center">
                    <Bell className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    System Clear
                  </p>
                </div>
              ) : (
                notifications.map((n) => {
                  const styles = getTypeStyles(n.type);
                  return (
                    <div
                      key={n.id}
                      className={`p-5 flex gap-4 hover:bg-slate-50/50 transition-all group ${n.read ? "opacity-60" : "bg-white"}`}
                    >
                      <div className={`p-2.5 rounded-xl h-fit ${styles.bg}`}>
                        <styles.icon className={`w-4 h-4 ${styles.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p
                            className={`text-[11px] font-black uppercase tracking-tight ${styles.color}`}
                          >
                            {n.title}
                          </p>
                          <button
                            onClick={() => deleteNotification(n.id)}
                            className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {n.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
                View Audit Archive
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
