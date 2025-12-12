import axios from "axios";
import FormData from "form-data";

interface KestraWorkflowInput {
  alertId: string;
  animalType: string;
  injuryLocation: string;
  severity: number;
  ngoEmail: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

export async function triggerKestraWorkflow(
  alertId: string,
  data: Omit<KestraWorkflowInput, "alertId">
): Promise<{ executionId: string }> {
  try {
    const formData = new FormData();

    // Flattened inputs – one field per input
    formData.append("alertId", alertId);
    formData.append("animalType", data.animalType);
    formData.append("injuryLocation", data.injuryLocation);
    formData.append("severity", String(data.severity));
    formData.append("ngoEmail", data.ngoEmail);
    formData.append("imageUrl", data.imageUrl);
    formData.append("latitude", String(data.latitude));
    formData.append("longitude", String(data.longitude));

    const response = await axios.post(
      `${process.env.KESTRA_URL}/api/v1/main/executions/aras.rescue/rescue-workflow`,
      formData,
      {
        // Let form-data set the correct multipart boundary headers
        headers: {
          ...formData.getHeaders(),
        },
        auth: {
          username: process.env.KESTRA_USERNAME || "",
          password: process.env.KESTRA_PASSWORD || "",
        },
      }
    );

    return {
      executionId: response.data.id || response.data.executionId,
    };
  } catch (error: any) {
    console.error("Error triggering Kestra workflow:");
    console.error("Status:", error.response?.status);
    console.error("Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Message:", error.message);
    throw new Error(
      `Failed to trigger Kestra workflow: ${
        error.response?.status
      } - ${JSON.stringify(error.response?.data)}`
    );
  }
}
