"use client";

import React from "react";

interface State {
  error: Error | null;
}

/**
 * 全局 React 错误边界。
 *
 * 作用：捕获渲染期 / 生命周期内的未捕获异常，避免整棵树崩溃成「白屏死壳」，
 * 把小朋友困在无法操作的界面里。这是结构 / 渲染崩溃的兜底，不承载产品逻辑。
 *
 * 抓不到：事件回调、setTimeout、fetch 等异步里的异常——那些各自 try/catch。
 *
 * 排障：崩溃详情写入 localStorage（`csf-crash-log`，最多 5 条），
 * 桌面版另有 `ai-server.log`；无任何后端上报，纯本地。
 */
export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    try {
      const key = "csf-crash-log";
      const prev: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      const list = Array.isArray(prev) ? prev : [];
      list.unshift({
        t: new Date().toISOString(),
        message: String(error?.message || error),
        stack: String(error?.stack || "").slice(0, 2000),
        component: String(info?.componentStack || "").slice(0, 1000),
      });
      localStorage.setItem(key, JSON.stringify(list.slice(0, 5)));
    } catch {
      /* localStorage 不可用时忽略 */
    }
    console.error("[ErrorBoundary] 渲染异常:", error, info?.componentStack);
  }

  componentDidMount() {
    // hydration 成功的信号：bootScript 的启动诊断据此判断「已正常启动」。
    (window as unknown as { __csfHydrated?: boolean }).__csfHydrated = true;
  }

  private reload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  private retry = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">
          <div className="text-5xl">🐣</div>
          <h1 className="mt-3 text-xl font-extrabold text-[#1B1F23]">页面出了一点小问题</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5A6B73]">
            聪聪学堂遇到了一点故障，但你的学习进度已保存在本机。
            点下面的按钮重新载入，就能继续学习。
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={this.retry}
              className="rounded-2xl border-2 border-[#E5E5E5] px-5 py-2.5 text-sm font-bold text-[#1B1F23] active:scale-95"
            >
              重试
            </button>
            <button
              onClick={this.reload}
              className="rounded-2xl bg-[#58CC02] px-5 py-2.5 text-sm font-bold text-white shadow-lg active:scale-95"
            >
              重新载入
            </button>
          </div>
          <details className="mt-4 text-left text-xs text-[#8A9AA1]">
            <summary className="cursor-pointer">错误详情（反馈时可附上）</summary>
            <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words">
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
