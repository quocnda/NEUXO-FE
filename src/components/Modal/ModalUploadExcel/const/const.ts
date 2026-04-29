export const data_icp = [
  {
    id: 'bf11b47c-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Consultant',
  },
  {
    id: 'bf11b4b7-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Dev Agency',
  },
  {
    id: '32346a70-fb23-4203-b4c3-37b3d3baeb79',
    icp_name: 'Digital Asset',
  },
  {
    id: 'bf11b4f3-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Enterprise transition W2 -> W3',
  },
  {
    id: 'bf11b39c-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Game Studio W2 & W3',
  },
  {
    id: 'bf11b325-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Game Studio Web2',
  },
  {
    id: 'bf11b42f-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Infra',
  },
  {
    id: 'bf118127-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Layer 1',
  },
  {
    id: 'bf11b15a-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Layer 2',
  },
  {
    id: 'bf11b531-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Protocol',
  },
  {
    id: 'bf11b3e2-e36d-11ef-b981-00155d9759e9',
    icp_name: 'Retail Business',
  },
  {
    id: '51deb866-670e-483a-ba4f-81923749347e',
    icp_name: 'Stable Coin',
  },
  {
    id: 'ce1baeef-734b-4e3f-9bef-bf5a4f38ac3e',
    icp_name: 'Web3 business',
  },
];

export const convertICPLabelToId = (records: any[]) => {
  return records.map((record: any) => {
    const matchedICP = data_icp.find((icp: any) => icp.icp_name === record.company_ICP);
    return {
      ...record,
      company_ICP: matchedICP ? matchedICP.id.replace(/-/g, '') : null,
    };
  });
};
