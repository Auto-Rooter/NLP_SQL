import { IDataSourceDocument, IDataSourceProjectID } from "@/interfaces/datasource.interface";
import { Datasource } from "@/entities/datasource.entity";
import { AppDataSource } from "@/database/config";
import { GraphQLError } from "graphql";
import { decodeBase64 } from "@/utils/utils";

export class DatasourceService {
  static async createNewDataSource(data: IDataSourceDocument): Promise<IDataSourceDocument> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      return datasourceRepository.save(data);
    }catch(error: any){
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSourceByProjectId(projectId: string): Promise<IDataSourceDocument> {
    try{
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceDocument = datasourceRepository.findOne({ where: { projectId }}) as unknown as IDataSourceDocument;
      return result;
    }catch(error: any){
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSourceById(datasourceId: string): Promise<IDataSourceDocument> {
    try{
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceDocument = datasourceRepository.findOne({ where: { id: datasourceId }}) as unknown as IDataSourceDocument;
      return result;
    }catch(error: any){
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSources(userId: string): Promise<IDataSourceProjectID[]> {
    try{
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceProjectID[] = datasourceRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      }) as unknown as IDataSourceProjectID[];
      const datasources: IDataSourceProjectID[] = result.map((item)=>{
        const { id, projectId, type, database } = item;
        return {
          id,
          projectId,
          type,
          database: database && database.length ? decodeBase64(database) : ''
        };
      }) as IDataSourceProjectID[];
      return datasources;
    }catch(error: any){
      throw new GraphQLError(error?.message);
    }
  }
}