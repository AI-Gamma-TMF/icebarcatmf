import React from "react";
import { Pie } from "react-chartjs-2";
import { Modal, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const bonusTypeColorMap = {
    amoeBonus: "#FF6384",
    tierBonus: "#36A2EB",
    dailyBonus: "#FFCE56",
    packageBonus: "#4BC0C0",
    rafflePayout: "#9966FF",
    welcomeBonus: "#FF9F40",
    jackpotWinner: "#C71585",
    providerBonus: "#00A36C",
    referralBonus: "#D2691E",
    affiliateBonus: "#8A2BE2",
    promotionBonus: "#DC143C",
    weeklyTierBonus: "#2E8B57",
    monthlyTierBonus: "#6495ED",
    tournamentWinner: "#FF4500",
    adminAddedScBonus: "#FFD700",
    crmPromocodeBonus: "#A52A2A",
    purchasePromocodeBonus: "#20B2AA",
    scratchCardBonus: "#B8860B",
    vipQuestionnaireBonus: "#00CED1",
    total: "#CCCCCC",
};

const SCBonusModal = ({ show, onClose, bonusDataV2 }) => {

    const bonusReport = Object.entries(bonusDataV2 || {})
        .filter(([bonusType, reports]) => {
            if (bonusType === "total") return false;
            const today = reports?.TODAY_BONUS_REPORT;
            return today && today.scBonus > 0;
        })
        .map(([bonusType, reports]) => ({
            label: bonusType,
            value: reports.TODAY_BONUS_REPORT.scBonus,
        }));

    const totalSCBonus = bonusReport?.reduce((sum, e) => sum + e.value, 0);

    const chartData = {
        labels: bonusReport?.map((e) => e.label),
        datasets: [
            {
                label: "SC Bonus by Type",
                data: bonusReport?.map((e) => e?.value),
                backgroundColor: bonusReport?.map((e) => bonusTypeColorMap[e.label] || "#ccc"),
                borderColor: "#fff",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: "bottom",
            },
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        return `${ctx.label}: ${parseFloat(ctx.raw).toFixed(2)}`;
                    },
                },
            },
        },
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header>
                <Modal.Title>SC Bonus Distribution (Today)</Modal.Title>
                <Button
                    variant="link"
                    onClick={onClose}
                    style={{ fontSize: "1.2rem", marginLeft: "auto" }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </Button>
            </Modal.Header>

            <Modal.Body style={{ textAlign: "center" }}>
                {bonusReport?.length > 0 ? (
                    <>
                        <div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
                            <Pie data={chartData} options={chartOptions} />
                        </div>
                        <div className="mt-3">
                            <strong>Total SC Bonus:</strong> {totalSCBonus.toFixed(2)}
                        </div>
                    </>
                ) : (
                    <div className="mt-3" style={{ color: "red" }}>
                        No SC Bonus Data Available for Today
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};


export default SCBonusModal;
