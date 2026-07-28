import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  headerRight: {
    textAlign: "right",
  },
  invoiceTitle: {
    fontSize: 10,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  billToSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 8,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  clientText: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 2,
  },
  table: {
    width: "auto",
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 8,
    marginBottom: 8,
  },
  col1: { width: "60%" },
  col2: { width: "20%", textAlign: "right" },
  col3: { width: "20%", textAlign: "right" },
  tableHeaderText: {
    fontSize: 8,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 8,
    color: "#666666",
  },
  itemPrice: {
    fontSize: 10,
  },
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    color: "#666666",
  },
  summaryValue: {
    fontSize: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 8,
    marginTop: 4,
  },
  totalText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 8,
    color: "#999999",
    textAlign: "center",
    letterSpacing: 1,
  },
});

export function InvoiceDocument({ inquiry }: { inquiry: any }) {
  const formatCurrency = (cents: number) => {
    return (
      "$" +
      (cents / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const invoiceId = `INV-${inquiry.id.split("-")[0].toUpperCase()}`;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>WICKED</Text>
            <Text
              style={{
                fontSize: 8,
                color: "#666666",
                marginTop: 4,
                letterSpacing: 1,
              }}
            >
              ATELIER BESPOKE
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoiceId}</Text>
            <Text style={{ fontSize: 8, color: "#666666", marginTop: 4 }}>
              {date}
            </Text>
          </View>
        </View>

        <View style={styles.billToSection}>
          <Text style={styles.sectionTitle}>BILLED TO</Text>
          <Text style={styles.clientName}>
            {inquiry.first_name} {inquiry.last_name}
          </Text>
          <Text style={styles.clientText}>{inquiry.email}</Text>
          <Text style={styles.clientText}>{inquiry.phone}</Text>
          <Text style={styles.clientText}>
            {inquiry.region || inquiry.location}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.col1}>
              <Text style={styles.tableHeaderText}>DESCRIPTION</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.tableHeaderText}>QTY</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.tableHeaderText}>AMOUNT</Text>
            </View>
          </View>

          {(inquiry.items || []).map((item: any, i: number) => (
            <View style={styles.tableRow} key={i}>
              <View style={styles.col1}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>
                  {item.color} • Size {item.size}
                </Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.itemPrice}>1</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.itemPrice}>
                  {formatCurrency(item.price_cents)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>SUBTOTAL</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(inquiry.total_cents)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>TOTAL DUE</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(inquiry.total_cents)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            THANK YOU FOR YOUR BESPOKE COMMISSION. PAYMENT IS DUE UPON RECEIPT.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
