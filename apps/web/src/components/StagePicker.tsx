"use client";

/**
 * StagePicker —— 首次进入时的「学段」引导（小学 / 初中 / 高中 / 大学）。
 *
 * 触发：useProgressStore.selectedStage === null
 * 完成后（一律 window.location.assign 硬跳转，规避静态导出 + 安卓 WebView 的软导航 404）：
 *   - 大学 → /grade/13/（大学无年级，直接进「大学」互动课程页）
 *   - 其他学段 → setSelectedStage(stage) + /stage/{stage}/versions/
 *     （选完学段先按科目选教材版本，再进年级选择）
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useProgressStore } from "@/store/progress";
import { Mascot } from "@/components/Mascot";
import { SpeechBubble } from "@/components/SpeechBubble";
import { STAGES, gradeFullName, type StageMeta } from "@cstf/core/stage";
import { cn } from "@/lib/cn";
import { playSfx } from "@/lib/sfx";
import { haptic } from "@/lib/haptic";

export function StagePicker() {
  const setSelectedStage = useProgressStore(s => s.setSelectedStage);
  const [picked, setPicked] = useState<StageMeta | null>(null);

  function handlePick(stage: StageMeta) {
    playSfx("tap");
    haptic("light");
    setPicked(stage);
  }

  function handleContinue() {
    if (!picked) return;
    playSfx("star");
    haptic("success");
    setSelectedStage(picked.id);
    // 一律硬跳转：静态导出（output: export + trailingSlash）+ 安卓 WebView 下
    // Next router 软导航偶发 404，window.location.assign 才可靠。
    //   大学：无年级概念 → 直接进「大学」互动课程页（grade 13）。
    //   其他学段：先按科目选教材版本（人教版 / 沪教版…内容不同），再选年级。
    if (picked.isCollege) {
      window.location.assign("/grade/13/");
    } else {
      window.location.assign(`/stage/${picked.id}/versions/`);
    }
  }

  return (
    // z-50：必须压过移动端固定底栏 BottomNav（z-40，且在 layout 中渲染于 children 之后，
    //       同 z-index 时 DOM 靠后会盖在上面）——否则底部「继续」按钮被底栏盖住点不到，
    //       表现为「选完学段无法确定」。与 ReviewRunnerClient 的底栏同一处理。
    <div className="fixed inset-0 z-50 bg-bg flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start pt-12 px-5 overflow-y-auto pb-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 18 }}
          className="flex items-end gap-3 mb-8 max-w-md w-full"
        >
          <Mascot size={96} mood="wave" />
          <div className="mb-2">
            <SpeechBubble text="你现在读哪个学段呀？" tone="neutral" />
          </div>
        </motion.div>

        <div className="w-full max-w-md flex flex-col gap-3">
          {STAGES.map((stage, i) => {
            const selected = picked?.id === stage.id;
            return (
              <motion.button
                key={stage.id}
                type="button"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePick(stage)}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl border-2 text-left transition-colors select-none",
                  selected
                    ? "border-secondary bg-secondary/10"
                    : "border-bg-softer bg-white hover:border-secondary/40",
                )}
                style={{
                  boxShadow: selected
                    ? "0 4px 0 0 #1899D6"
                    : "0 3px 0 0 var(--shadow-card-color)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-extrabold text-2xl"
                  style={{ backgroundColor: stage.color }}
                >
                  {stage.short}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-base font-extrabold leading-tight",
                      selected ? "text-secondary-dark" : "text-ink",
                    )}
                  >
                    {stage.name}
                  </div>
                  <div className="text-xs text-ink-light mt-0.5">
                    {stage.isCollege
                      ? "按学科 / 课程组织"
                      : stage.grades.map(g => gradeFullName(g)).join(" / ")}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="border-t-2 border-bg-softer bg-white">
        <div className="max-w-md mx-auto px-5 py-4 flex justify-end">
          {picked != null && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleContinue}
              className="btn-chunky-primary px-10"
            >
              继续
            </motion.button>
          )}
          {picked == null && (
            <button type="button" disabled className="btn-chunky-disabled px-10">
              继续
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
