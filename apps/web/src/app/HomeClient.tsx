"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProgressStore } from "@/store/progress";
import { GradePicker } from "@/components/GradePicker";
import { StagePicker } from "@/components/StagePicker";
import { stageOfGrade, type StageId } from "@cstf/core/stage";

interface HomeClientProps {
  grades: number[];
  byGrade: Record<number, number>;
  totalBooks: number;
  totalLessons: number;
  totalQuestions: number;
}

/**
 * 首页路由分发（打开即路径）：
 *   - 未选学段 → 渲染 StagePicker 引导（小学 / 初中 / 高中 / 大学）
 *   - 已选学段 = 大学 → 直接进 /grade/13/
 *   - 已选学段但没选年级 → 渲染该学段内的 GradePicker
 *   - 已选年级且有当前教材 → 软跳 /book/{id}/
 *   - 已选年级无教材 → 软跳 /grade/{grade}/
 *
 * 关键约定（用户投诉修复）：**学段只选一次**。
 *   - GradesPicker 上提供显式的「切换学段」入口（清 selectedStage）；
 *   - 年级页的「切换教材」只清 selectedGrade/activeBookId，**不动 selectedStage**；
 *   - 学段历史 lastStage 兜底（v15）：切换学段会把它一起清空，
 *     但只要它是被"意外丢失 selectedStage"（老档 / 部分写入）导致的，
 *     首页仍会用它恢复，绝不把用户打回学段引导；
 *   - 若学段字段全丢但还记得年级，用 stageOfGrade(grade) 反推（自愈）。
 */
export function HomeClient(_props: HomeClientProps) {
  const selectedStage = useProgressStore(s => s.selectedStage);
  const lastStage = useProgressStore(s => s.lastStage);
  const selectedGrade = useProgressStore(s => s.selectedGrade);
  const activeBookId = useProgressStore(s => s.activeBookId);
  const setActiveBookId = useProgressStore(s => s.setActiveBookId);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  /**
   * 生效学段（三级自愈，越往后越保守）：
   *   1. 已选学段 selectedStage（正常路径）
   *   2. 学段历史 lastStage（字段级容错兜底）
   *   3. 年级反推 stageOfGrade(grade)（老档 / 字段缺失的最后一道防线）
   * 任何一级命中都不会把用户打回学段引导重选。
   */
  const effectiveStage: StageId | null =
    selectedStage ??
    lastStage ??
    (selectedGrade != null ? stageOfGrade(selectedGrade) : null);

  useEffect(() => {
    if (!hydrated) return;
    if (effectiveStage == null) return; // 交给 StagePicker
    if (effectiveStage === "college" && selectedGrade == null) {
      // 大学：无年级概念，直接进入「大学」互动课程页（grade 13）
      router.replace("/grade/13/");
      return;
    }
    if (selectedGrade == null) return; // 交给 GradePicker(stage)
    if (activeBookId) {
      router.replace(`/book/${activeBookId}/`);
    } else {
      router.replace(`/grade/${selectedGrade}/`);
    }
  }, [hydrated, effectiveStage, selectedStage, lastStage, selectedGrade, activeBookId, setActiveBookId, router]);

  // 跳转前渲染空底色占位，避免闪 StagePicker / GradePicker
  if (!hydrated) {
    return <div className="min-h-screen bg-bg" />;
  }
  if (effectiveStage == null) {
    return <StagePicker />;
  }
  if (effectiveStage === "college") {
    // 大学无年级：由上面的 effect 直接 replace 到 /grade/13/
    return <div className="min-h-screen bg-bg" />;
  }
  if (selectedGrade == null) {
    return <GradePicker stage={effectiveStage} />;
  }
  return <div className="min-h-screen bg-bg" />;
}
