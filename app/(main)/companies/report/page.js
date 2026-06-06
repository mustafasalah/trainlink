import React from "react";
import { redirect } from "next/navigation";
import connectDB from "@/app/DBconnection";
import Company from "@/app/models/Company";
import { getAuthUser } from "@/app/auth";
import PrintReportButton from "@/app/components/PrintReportButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Companies Agreements Report",
};

function formatDate(date) {
  if (!date) return "-";

  try {
    return new Date(date).toISOString().slice(0, 10);
  } catch (_) {
    return "-";
  }
}

export default async function CompaniesAgreementsReportPage() {
  const loggedUser = await getAuthUser();

  if (!loggedUser || loggedUser.role !== "ERO") {
    redirect("/companies");
  }

  await connectDB();

  const companies = await Company.find({})
    .select(
      "name industry agreement.date agreement.period agreement.renewal_type agreement.nature createdAt",
    )
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="content">
      <div className="report-page" dir="rtl">
        <div className="report-actions">
          <PrintReportButton />
        </div>

        <div className="report-header">
          <h2>جامعة السودان للعلوم والتكنولوجيا</h2>
          <h3>تقرير اتفاقيات ومذكرات التفاهم التدريبية</h3>
          <p>
            يحتوي هذا التقرير على الشركات المسجلة في النظام وتفاصيل الاتفاقيات
            الخاصة بها.
          </p>
        </div>

        <table className="agreements-report-table">
          <thead>
            <tr>
              <th>م</th>
              <th>الاتفاقية / الشركة</th>
              <th>تاريخ التوقيع</th>
              <th>المدة</th>
              <th>نوع التجديد</th>
              <th>طبيعة الاتفاقية</th>
              <th>الجهة المستفيدة / ذات الصلة</th>
            </tr>
          </thead>

          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="7">لا توجد شركات مسجلة.</td>
              </tr>
            ) : (
              companies.map((company, index) => (
                <tr key={company._id.toString()}>
                  <td>{index + 1}</td>

                  <td>{company.name || "-"}</td>

                  <td>{formatDate(company.agreement?.date)}</td>

                  <td>{company.agreement?.period || "-"}</td>

                  <td>{company.agreement?.renewal_type || "-"}</td>

                  <td>{company.agreement?.nature || "-"}</td>

                  <td>{company.industry || "عامّة"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
