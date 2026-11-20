from datetime import time
from typing import List, Tuple
from .models import Schedule

def has_time_overlap(start1: time, end1: time, start2: time, end2: time) -> bool:
    """Checks if time intervals [start1, end1] and [start2, end2] overlap."""
    return max(start1, start2) < min(end1, end2)

def detect_schedule_conflicts(schedule_ids: List[str]) -> List[Tuple[str, str, str]]:
    """
    Detects if any schedules in the given list overlap in day and time.
    Returns list of conflict tuples: (schedule1_id, schedule2_id, conflict_reason)
    """
    schedules = list(Schedule.objects.filter(id__in=schedule_ids).select_related('course_class__course', 'room'))
    conflicts = []

    for i in range(len(schedules)):
        for j in range(i + 1, len(schedules)):
            s1 = schedules[i]
            s2 = schedules[j]

            if s1.day == s2.day and has_time_overlap(s1.start_time, s1.end_time, s2.start_time, s2.end_time):
                reason = f"Bentrok pada hari {s1.day}: {s1.course_class.course.name} ({s1.start_time.strftime('%H:%M')}-{s1.end_time.strftime('%H:%M')}) dan {s2.course_class.course.name} ({s2.start_time.strftime('%H:%M')}-{s2.end_time.strftime('%H:%M')})"
                conflicts.append((str(s1.id), str(s2.id), reason))

    return conflicts
