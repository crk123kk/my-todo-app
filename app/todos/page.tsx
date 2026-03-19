"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Todo {
  id: number;
  content: string;
  done: boolean;
  createdAt: string;
}

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  function getToken() {
    return localStorage.getItem("token") || "";
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setEmail(localStorage.getItem("email") || "");
    fetchTodos(token);
  }, [router]);

  async function fetchTodos(token: string) {
    try {
      const res = await fetch("/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }
      const data = await res.json();
      setTodos(data);
    } catch {
      setError("加载失败，请刷新重试");
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setAdding(true);

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content: input.trim() }),
      });
      const todo = await res.json();
      if (res.ok) {
        setTodos((prev) => [todo, ...prev]);
        setInput("");
      }
    } finally {
      setAdding(false);
    }
  }

  async function toggleTodo(id: number) {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  }

  async function deleteTodo(id: number) {
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/login");
  }

  const done = todos.filter((t) => t.done).length;
  const total = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span className="font-bold text-gray-900 text-lg">我的待办</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{email}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-red-500 transition"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        {total > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">今日进度</span>
                <span className="text-sm font-semibold text-indigo-600">
                  {done} / {total} 完成
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 输入框 */}
        <form onSubmit={addTodo} className="flex gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入新的待办事项..."
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 shadow-sm"
          />
          <button
            type="submit"
            disabled={adding || !input.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition shadow-sm whitespace-nowrap"
          >
            {adding ? "添加中" : "+ 添加"}
          </button>
        </form>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Todo 列表 */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">加载中...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500">还没有待办事项</p>
            <p className="text-gray-400 text-sm mt-1">在上方输入框添加你的第一个任务</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="bg-white rounded-xl shadow-sm px-4 py-4 flex items-center gap-4 group hover:shadow-md transition"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition flex items-center justify-center ${
                    todo.done
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {todo.done && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <span
                  className={`flex-1 text-sm sm:text-base transition ${
                    todo.done ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {todo.content}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-50"
                  title="删除"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
