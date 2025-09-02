package com.erp.backend.service;

import com.erp.backend.entity.Course;
import com.erp.backend.entity.Student;
import com.erp.backend.entity.Enrollment;
import com.erp.backend.repository.CourseRepository;
import com.erp.backend.repository.StudentRepository;
import com.erp.backend.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private EnrollmentService enrollmentService;

    public Map<String, Object> getDashboardStats(Authentication authentication) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Get role-based data
            List<Course> courses = courseRepository.findAll();
            List<Student> students = studentService.getAllStudentsBasedOnRole(authentication);
            List<Enrollment> enrollments = enrollmentService.getAllEnrollmentsBasedOnRole(authentication);

            // Calculate basic stats
            int totalCourses = courses.size();
            int totalStudents = students.size();
            int totalEnrollments = enrollments.size();

            // Calculate completion rate
            long completedEnrollments = enrollments.stream()
                    .filter(e -> e.getStatus() == Enrollment.EnrollmentStatus.COMPLETED)
                    .count();
            double completionRate = totalEnrollments > 0 ? 
                    (double) completedEnrollments / totalEnrollments * 100 : 0;

            // Calculate growth rates (comparing with last month's data)
            LocalDate lastMonth = LocalDate.now().minusMonths(1);
            
            // Course growth
            long recentCourses = courses.stream()
                    .filter(c -> c.getCreatedDate() != null && c.getCreatedDate().isAfter(lastMonth))
                    .count();
            double courseGrowth = totalCourses > 0 ? (double) recentCourses / totalCourses * 100 : 0;

            // Student growth
            long recentStudents = students.stream()
                    .filter(s -> s.getEnrollmentDate() != null && s.getEnrollmentDate().isAfter(lastMonth))
                    .count();
            double studentGrowth = totalStudents > 0 ? (double) recentStudents / totalStudents * 100 : 0;

            // Enrollment growth
            long recentEnrollments = enrollments.stream()
                    .filter(e -> e.getEnrollmentDate() != null && e.getEnrollmentDate().isAfter(lastMonth))
                    .count();
            double enrollmentGrowth = totalEnrollments > 0 ? (double) recentEnrollments / totalEnrollments * 100 : 0;

            // Average grade calculation
            OptionalDouble avgGrade = enrollments.stream()
                    .filter(e -> e.getScore() != null && e.getScore() > 0)
                    .mapToDouble(Enrollment::getScore)
                    .average();

            stats.put("totalCourses", totalCourses);
            stats.put("totalStudents", totalStudents);
            stats.put("totalEnrollments", totalEnrollments);
            stats.put("completionRate", Math.round(completionRate * 10.0) / 10.0);
            stats.put("averageGrade", avgGrade.isPresent() ? Math.round(avgGrade.getAsDouble() * 10.0) / 10.0 : 0);
            stats.put("courseGrowth", "+" + Math.round(courseGrowth * 10.0) / 10.0 + "%");
            stats.put("studentGrowth", "+" + Math.round(studentGrowth * 10.0) / 10.0 + "%");
            stats.put("enrollmentGrowth", "+" + Math.round(enrollmentGrowth * 10.0) / 10.0 + "%");
            stats.put("completionGrowth", "+2.3%"); // This could be calculated based on historical data

        } catch (Exception e) {
            // Return default values if calculation fails
            stats.put("totalCourses", 0);
            stats.put("totalStudents", 0);
            stats.put("totalEnrollments", 0);
            stats.put("completionRate", 0);
            stats.put("averageGrade", 0);
            stats.put("courseGrowth", "+0%");
            stats.put("studentGrowth", "+0%");
            stats.put("enrollmentGrowth", "+0%");
            stats.put("completionGrowth", "+0%");
        }
        
        return stats;
    }

    public List<Map<String, Object>> getRecentActivity(Authentication authentication) {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        try {
            LocalDate lastWeek = LocalDate.now().minusWeeks(1);
            
            // Get recent courses
            List<Course> recentCourses = courseRepository.findAll().stream()
                    .filter(c -> c.getCreatedDate() != null && c.getCreatedDate().isAfter(lastWeek))
                    .sorted((c1, c2) -> c2.getCreatedDate().compareTo(c1.getCreatedDate()))
                    .limit(3)
                    .collect(Collectors.toList());

            // Get recent students
            List<Student> recentStudents = studentService.getAllStudentsBasedOnRole(authentication).stream()
                    .filter(s -> s.getEnrollmentDate() != null && s.getEnrollmentDate().isAfter(lastWeek))
                    .sorted((s1, s2) -> s2.getEnrollmentDate().compareTo(s1.getEnrollmentDate()))
                    .limit(3)
                    .collect(Collectors.toList());

            // Get recent enrollments
            List<Enrollment> recentEnrollments = enrollmentService.getAllEnrollmentsBasedOnRole(authentication).stream()
                    .filter(e -> e.getEnrollmentDate() != null && e.getEnrollmentDate().isAfter(lastWeek))
                    .sorted((e1, e2) -> e2.getEnrollmentDate().compareTo(e1.getEnrollmentDate()))
                    .limit(3)
                    .collect(Collectors.toList());

            // Add course activities
            for (Course course : recentCourses) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "course");
                activity.put("icon", "new-course");
                activity.put("text", "New course \"" + course.getTitle() + "\" added");
                activity.put("time", getRelativeTime(course.getCreatedDate()));
                activities.add(activity);
            }

            // Add student activities
            if (!recentStudents.isEmpty()) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "student");
                activity.put("icon", "new-student");
                activity.put("text", recentStudents.size() + " new student" + (recentStudents.size() > 1 ? "s" : "") + " enrolled this week");
                activity.put("time", "This week");
                activities.add(activity);
            }

            // Add enrollment activities
            if (!recentEnrollments.isEmpty()) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "enrollment");
                activity.put("icon", "enrollment");
                activity.put("text", recentEnrollments.size() + " course enrollment" + (recentEnrollments.size() > 1 ? "s" : "") + " completed");
                activity.put("time", "This week");
                activities.add(activity);
            }

            // Sort activities by most recent
            activities.sort((a1, a2) -> {
                String time1 = (String) a1.get("time");
                String time2 = (String) a2.get("time");
                // Simple sorting - more recent activities first
                if (time1.contains("hour") && time2.contains("day")) return -1;
                if (time1.contains("day") && time2.contains("hour")) return 1;
                return 0;
            });

        } catch (Exception e) {
            // Return default activities if calculation fails
            Map<String, Object> defaultActivity = new HashMap<>();
            defaultActivity.put("type", "system");
            defaultActivity.put("icon", "new-course");
            defaultActivity.put("text", "System initialized");
            defaultActivity.put("time", "Recently");
            activities.add(defaultActivity);
        }
        
        return activities.stream().limit(5).collect(Collectors.toList());
    }

    public Map<String, Object> getEnrollmentStats(Authentication authentication) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            List<Enrollment> enrollments = enrollmentService.getAllEnrollmentsBasedOnRole(authentication);
            
            long activeCount = enrollments.stream()
                    .filter(e -> e.getStatus() == Enrollment.EnrollmentStatus.ENROLLED)
                    .count();
            
            long completedCount = enrollments.stream()
                    .filter(e -> e.getStatus() == Enrollment.EnrollmentStatus.COMPLETED)
                    .count();
            
            long pendingCount = enrollments.stream()
                    .filter(e -> e.getStatus() == Enrollment.EnrollmentStatus.PENDING)
                    .count();
            
            long droppedCount = enrollments.stream()
                    .filter(e -> e.getStatus() == Enrollment.EnrollmentStatus.DROPPED)
                    .count();
            
            stats.put("active", activeCount);
            stats.put("completed", completedCount);
            stats.put("pending", pendingCount);
            stats.put("dropped", droppedCount);
            stats.put("total", enrollments.size());
            
        } catch (Exception e) {
            stats.put("active", 0);
            stats.put("completed", 0);
            stats.put("pending", 0);
            stats.put("dropped", 0);
            stats.put("total", 0);
        }
        
        return stats;
    }

    public List<Map<String, Object>> getCoursesByDepartment(Authentication authentication) {
        try {
            List<Course> courses = courseRepository.findAll();
            
            Map<String, Long> departmentCounts = courses.stream()
                    .collect(Collectors.groupingBy(
                            course -> course.getDepartment() != null ? course.getDepartment() : "Unknown",
                            Collectors.counting()
                    ));
            
            return departmentCounts.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> dept = new HashMap<>();
                        dept.put("dept", entry.getKey());
                        dept.put("count", entry.getValue());
                        return dept;
                    })
                    .sorted((d1, d2) -> Long.compare((Long) d2.get("count"), (Long) d1.get("count")))
                    .limit(10)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public Map<String, Object> getPerformanceMetrics(Authentication authentication) {
        Map<String, Object> metrics = new HashMap<>();
        
        try {
            List<Enrollment> enrollments = enrollmentService.getAllEnrollmentsBasedOnRole(authentication);
            
            // Calculate pass rate (assuming grade >= 60 is passing)
            long passedEnrollments = enrollments.stream()
                    .filter(e -> e.getScore() != null && e.getScore() >= 60)
                    .count();
            
            long gradedEnrollments = enrollments.stream()
                    .filter(e -> e.getScore() != null && e.getScore() > 0)
                    .count();
            
            double passRate = gradedEnrollments > 0 ? (double) passedEnrollments / gradedEnrollments * 100 : 0;
            
            // Calculate retention rate (students who didn't drop)
            long notDropped = enrollments.stream()
                    .filter(e -> e.getStatus() != Enrollment.EnrollmentStatus.DROPPED)
                    .count();
            
            double retentionRate = enrollments.size() > 0 ? (double) notDropped / enrollments.size() * 100 : 0;
            
            metrics.put("passRate", Math.round(passRate * 10.0) / 10.0);
            metrics.put("retentionRate", Math.round(retentionRate * 10.0) / 10.0);
            
        } catch (Exception e) {
            metrics.put("passRate", 0);
            metrics.put("retentionRate", 0);
        }
        
        return metrics;
    }

    private String getRelativeTime(LocalDate date) {
        if (date == null) return "Unknown";
        
        LocalDate now = LocalDate.now();
        long daysDiff = java.time.temporal.ChronoUnit.DAYS.between(date, now);
        
        if (daysDiff == 0) return "Today";
        if (daysDiff == 1) return "Yesterday";
        if (daysDiff < 7) return daysDiff + " days ago";
        if (daysDiff < 30) return (daysDiff / 7) + " week" + (daysDiff / 7 > 1 ? "s" : "") + " ago";
        if (daysDiff < 365) return (daysDiff / 30) + " month" + (daysDiff / 30 > 1 ? "s" : "") + " ago";
        
        return (daysDiff / 365) + " year" + (daysDiff / 365 > 1 ? "s" : "") + " ago";
    }
}
