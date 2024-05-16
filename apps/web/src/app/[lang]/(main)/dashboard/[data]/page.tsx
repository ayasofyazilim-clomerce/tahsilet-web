"use client";
import Dashboard from '@repo/ayasofyazilim-ui/templates/dashboard';
import { $Volo_Abp_Identity_IdentityRoleDto as tableType, $Volo_Abp_Identity_IdentityRoleCreateDto as roleCreate } from "@ayasofyazilim/saas/IdentityService"
import { useEffect, useState } from 'react';
import { createZodObject, getBaseLink } from 'src/utils';
import { tableAction } from '@repo/ayasofyazilim-ui/molecules/tables';

export default function Page({ params }: { params: { data: string } }): JSX.Element {
    const [roles, setRoles] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const fetchLink = getBaseLink("/api/admin/" + params.data);
    console.log(fetchLink);
    function getRoles() {
        fetch(fetchLink)
            .then((res) => res.json())
            .then((data) => {
                setRoles(data);
                setIsLoading(false);
            });
    }
    const formPositions = ["name", "isDefault", "isPublic"];
    const formSchema = createZodObject(roleCreate, formPositions)
    const autoFormArgs = {
        formSchema,
    };

    const action: tableAction = {
        cta: "New Role",
        description: "Create a new role for users",
        autoFormArgs,
        callback: (e) => {
            fetch(fetchLink, {
                method: 'POST',
                body: JSON.stringify(e)
            }).then(response => response.json()) // Parse the response as JSON
                .then(data => {
                    getRoles();
                }) // Do something with the response data
                .catch((error) => {
                    console.error('Error:', error); // Handle any errors
                });
        }
    };
    const tableHeaders = [
        {
            name: "name",
            isSortable: true,
        },
        {
            name: "isDefault",
        },
        {
            name: "isPublic",
        },
        {
            name: "userCount"
        }
    ]
    useEffect(() => {
        setIsLoading(true);
        getRoles();
    }, [])
    const rolesCards = roles?.items.slice(-4).map((item: any) => {
        return {
            title: item.name,
            content: item.userCount,
            description: "Users",
            footer: item.isPublic ? "Public" : "Not Public",
        };
    });

    const excludeList = ['id', 'extraProperties', 'concurrencyStamp']
    const onEdit = (data: any, row: any) => {
        fetch(fetchLink, {
            method: 'PUT',
            body: JSON.stringify({
                id: row.id,
                requestBody: JSON.stringify(data)
            })
        }).then(response => response.json()) // Parse the response as JSON
            .then(data => {
                getRoles();
            }) // Do something with the response data
            .catch((error) => {
                console.error('Error:', error); // Handle any errors
            });
    }
    const onDelete = (e: any, row: any) => {
        fetch(fetchLink, {
            method: 'DELETE',
            body: JSON.stringify(row.id)
        }).then(response => response.json()) // Parse the response as JSON
            .then(data => {
                console.log(data)
                getRoles();
            }) // Do something with the response data
            .catch((error) => {
                console.error('Error:', error); // Handle any errors
            });
    }

    const columnsData = {
        type: "Auto",
        data: { getRoles, autoFormArgs, tableType, excludeList, onEdit, onDelete }
    }

    return (
        <Dashboard
            withCards={true}
            withTable={true}
            isLoading={isLoading}
            filterBy="name"
            cards={rolesCards}
            data={roles?.items}
            columnsData={columnsData}
            action={action}
        />
    );
}
