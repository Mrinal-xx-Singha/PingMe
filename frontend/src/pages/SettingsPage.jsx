import { THEMES } from "../../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const SettingsPage = () => {
  const preview_msg = [
    { id: 1, content: "Hey, How's it going?", isSent: false },
    {
      id: 2,
      content: "I'm doing great! Just working on some new features.",
      isSent: true,
    },
  ];
  const { setTheme, theme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-100 py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="space-y-8">
          {/* Theme Selection Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Theme</h2>
              <p className="text-sm text-base-content/70">
                Choose a theme for your chat interface
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`
                    group flex flex-col items-center gap-2 p-3 rounded-lg transition-all
                    hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50
                    ${theme === t ? "bg-base-200 ring-2 ring-primary" : "hover:bg-base-200/50"}
                  `}
                  onClick={() => setTheme(t)}
                >
                  <div
                    className="relative h-10 w-full rounded-lg overflow-hidden shadow-sm"
                    data-theme={t}
                  >
                    <div className="absolute inset-0 grid grid-cols-4 gap-0.5 p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium truncate w-full text-center">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Preview Section */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold tracking-tight">Preview</h3>
            <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
              <div className="p-6 bg-base-200">
                <div className="max-w-2xl mx-auto">
                  {/* Mock Chat UI */}
                  <div className="bg-base-100 rounded-xl shadow-md overflow-hidden">
                    {/* Chat Header */}
                    <div className="px-4 py-3 border-b border-base-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium text-lg">
                          J
                        </div>
                        <div>
                          <h3 className="font-medium">John Doe</h3>
                          <p className="text-sm text-base-content/70">Online</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-6 space-y-6 min-h-[240px] max-h-[240px] overflow-y-auto">
                      {preview_msg.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.isSent ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`
                              max-w-[80%] rounded-2xl p-4 shadow-sm
                              ${
                                message.isSent
                                  ? "bg-primary text-primary-content"
                                  : "bg-base-200"
                              }
                            `}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p
                              className={`
                                text-xs mt-2
                                ${
                                  message.isSent
                                    ? "text-primary-content/70"
                                    : "text-base-content/70"
                                }
                              `}
                            >
                              12:00 PM
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-base-300">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 text-sm rounded-lg border border-base-300 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Type a message..."
                          value="This is a preview"
                          readOnly
                        />
                        <button className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50">
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;