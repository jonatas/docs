import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import styles from './styles.module.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CostComparison = () => {
  const [selectedSize, setSelectedSize] = useState("small");

  const dataConfig = {
    small: {
      labels: ["AWS", "GCP", "Azure", "DigitalOcean", "Hetzner"],
      cloudManagedCosts: [2083, 1956, 1610, 1536, 0],
      clusterCosts: [949, 1105, 953, 906, 251],
      cloudManagedDetails: [
        "Amazon RDS for PostgreSQL",
        "Google Cloud SQL for PostgreSQL",
        "Azure Database for PostgreSQL",
        "DigitalOcean PostgreSQL",
        "Hetzner Cloud PostgreSQL (Not Available)"
      ],
      clusterDetails: [
        "PostgreSQL Cluster",
        "PostgreSQL Cluster",
        "PostgreSQL Cluster",
        "PostgreSQL Cluster",
        "PostgreSQL Cluster (€251/month)"
      ],
      setupsManaged: [
        "db.m6id.2xlarge with 500GB EBS gp3",
        "Enterprise edition: 8 vCPU, 32GB RAM, 500GB storage",
        "D8s v3 with 500GB Standard SSD (LRS)",
        "8 vCPU, 32GB RAM, 500GB storage",
        "-"
      ],
      setupsCluster: [
        "m6i.2xlarge with 500GB EBS gp3",
        "n2-standard-8 with 500GB pd-ssd",
        "D8s v5 with 500GB Standard SSD (LRS)",
        "g-8vcpu-32gb with 500GB SSD",
        "CCX33 with 500GB SSD"
      ],
      differences: [-54, -43, -41, -41, "0"],
      label: "8 vCPU, 32GB RAM, 500GB storage"
    },
    medium: {
      labels: ["AWS", "GCP", "Azure", "DigitalOcean", "Hetzner"],
      cloudManagedCosts: [8095, 7154, 6217, 5586, 0],
      clusterCosts: [3557, 3913, 3588, 3324, 843],
      cloudManagedDetails: [
        "Amazon RDS for PostgreSQL",
        "Google Cloud SQL for PostgreSQL",
        "Azure Database for PostgreSQL",
        "DigitalOcean PostgreSQL",
        "Hetzner Cloud PostgreSQL (Not Available)"
      ],
      clusterDetails: [
        "PostgreSQL Cluster",
        "PostgreSQL Cluster",
        "PostgreSQL Cluster",
        "PostgreSQL Cluster",
        "PostgreSQL Cluster"
      ],
      setupsManaged: [
        "db.m6id.8xlarge with 1TB EBS gp3",
        "Enterprise edition",
        "D32s v5 with 1TB Standard SSD (LRS)",
        "g-32vcpu-128gb with 1TB SSD",
        "-"
      ],
      setupsCluster: [
        "m6i.8xlarge with 1TB EBS gp3",
        "n2-standard-32 with 10TB pd-ssd",
        "D32s v5 with 1TB Standard SSD (LRS)",
        "g-32vcpu-128gb with 1TB SSD",
        "CCX53 with 1TB SSD"
      ],
      differences: [-56, -45, -42, -40, "0"],
      label: "32 vCPU, 128GB RAM, 1TB storage"
    },
    large: {
      labels: ["AWS", "GCP", "Azure", "DigitalOcean", "Hetzner"],
      cloudManagedCosts: [33748, 31127, 28530, 0, 0],
      clusterCosts: [15463, 18872, 15495, 0, 0],
      cloudManagedDetails: [
        "Amazon RDS for PostgreSQL",
        "Google Cloud SQL for PostgreSQL",
        "Azure Database for PostgreSQL",
        "DigitalOcean PostgreSQL (Not Available)",
        "Hetzner Cloud PostgreSQL (Not Available)"
      ],
      clusterDetails: [
        "PostgreSQL Cluster",
        "PostgreSQL Cluster",
        "PostgreSQL Cluster",
        "-",
        "-"
      ],
      setupsManaged: [
        "db.r6id.24xlarge with 10TB EBS gp3",
        "Enterprise edition with 624 GB RAM",
        "E96ds v5 with 10TB Standard SSD (LRS)",
        "-",
        "-"
      ],
      setupsCluster: [
        "r6i.24xlarge with 10TB EBS gp3",
        "n2-highmem-96 with 10TB pd-ssd",
        "E96s v5 with 10TB Standard SSD (LRS)",
        "-",
        "-"
      ],
      differences: [-54, -39, -41, "0", "0"],
      label: "96 vCPU, 768GB RAM, 10TB storage"
    }
  };

  const { labels, cloudManagedCosts, clusterCosts, cloudManagedDetails, clusterDetails, setupsManaged, setupsCluster, differences, label } = dataConfig[selectedSize];

  const chartData = {
    labels,
    datasets: [
      {
        label: "PostgreSQL Cluster",
        data: clusterCosts,
        backgroundColor: "#42A5F5",
        stack: 'stack1',
        order: 1,
      },
      {
        label: "Cloud-managed PostgreSQL",
        data: cloudManagedCosts,
        backgroundColor: "#FFA726",
        stack: 'stack1',
        order: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            if (context.dataset.label === "Cloud-managed PostgreSQL") {
              return [
                `Service: ${cloudManagedDetails[index]}`,
                `Setup: ${setupsManaged[index]}`,
                `Cost: $${cloudManagedCosts[index]}/month`
              ];
            } else if (context.dataset.label === "PostgreSQL Cluster") {
              return [
                `Service: ${clusterDetails[index]}`,
                `Setup: ${setupsCluster[index]}`,
                `Cost: $${clusterCosts[index]}/month`,
                `Savings: ${differences[index]}%`
              ];
            }
            return `$${context.raw}/month`;
          }
        }
      }
    },
    scales: {
      x: { 
        stacked: true,
        display: true, 
        grid: { display: false },
        barPercentage: 1.0,
        categoryPercentage: 0.2,
      },
      y: {
        beginAtZero: true,
        stacked: true,
        title: { display: true, text: "Cost (USD/month)" },
      },
    },
  };

  return (
    <div className={styles.costComparisonSection}>
      <div className={styles.textBlock}>
        <h1>Cost comparison</h1>
        <p>
          The open-source alternative to cloud-managed databases with maximum cost-efficiency infrastructure.
        </p>
      </div>
      <div className={styles.chartAndTextContainer}>
        <div className={styles.chartContainer}>
          <h4>PostgreSQL Cluster vs Cloud-managed database</h4>
          <div className={styles.dropdown}>
            <select onChange={(e) => setSelectedSize(e.target.value)} value={selectedSize}>
              {Object.entries(dataConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <Bar data={chartData} options={options} />
          <p className={styles.smallText}>
            Note: Prices for a DB cluster with a primary DB instance and two readable standby DB instances (compute and storage).
          </p>
        </div>
        <div className={styles.textContainer}>
          <p>
            You gain the reliability of RDS-level service without additional costs, as our product is completely free.
          </p>
          <p>
            This means you only pay for the server resources you use, avoiding the overhead of managed database service fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostComparison;
