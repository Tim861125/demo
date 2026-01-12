/**
 * Patent Search Service
 * 调用 UPAT API 查询专利数量
 */

interface PatentSearchRequest {
  clientInfo: {
    ip: string;
    userName: string;
  };
  query: string;
  from: number;
  size: number;
  countries: string[];
}

interface PatentHit {
  pubDate_issued: string;
  title_issued: string;
  title_en_issued: string;
  kindCode_issued: string | null;
  pnRaw_issued: string;
  apd_issued: string;
  docKind_issued: string[];
  apnRaw_issued: string;
  database: string;
  isIssued: boolean;
  _index: string;
  id: string;
  _score: number;
}

interface PatentSearchResponse {
  total: number;
  hits: PatentHit[];
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  statusCode: number;
  status: string;
  aggs: Record<string, any>;
  esQueryString: string;
  esDataPostProcessTook: number;
}

export async function searchPatents(query: string): Promise<PatentSearchResponse> {
  const url = "http://upatx.ltc:3000/v2/api/patent_search";

  const requestBody: PatentSearchRequest = {
    clientInfo: {
      ip: "127.0.0.1",
      userName: "MCP-Server"
    },
    query: query,
    from: 0,
    size: 1,
    countries: ["TW"]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Patent search API error:", error);
    throw error;
  }
}
